#![allow(clippy::result_large_err)]

use anchor_lang:: prelude::*;
use anchor_spl::{
  associated_token::AssociatedToken,
  token_interface::{self,Mint,TokenAccount,TokenInterface,Transfer}
};

declare_id!("DKuSUxUKXDEjtcz2gS19StUd6BSk9APR8CdQ9SyJhNCm");

#[program]
mod crowdfunding{
  use super::*;

  pub fn create_campaign(ctx:Context<Campaign>,title:String,start_time:i64,deadline:i64)->Result<()>{
            let campaign = &mut ctx.accounts.campaign;
            campaign.owner=ctx.accounts.owner.key();
            campaign.mint=ctx.accounts.mint.key();
            campaign.vault=ctx.accounts.vault.key();
            campaign.title=title;
            campaign.start_time=start_time;
            campaign.deadline=deadline;
            campaign.amount_raised=0;
            
            campaign.bump = ctx.bumps.campaign;

    Ok(())
  }
  pub fn donate_to_campaign(ctx:Context<Donate>,amount:u64)->Result<()>{
    let donor = &mut ctx.accounts.donor_acc;
    let campaign = &mut ctx.accounts.campaign;
    donor.donor_pubkey=ctx.accounts.signer.key();
    donor.amount = amount;
    token_interface::transfer(
      CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer{
          from:ctx.accounts.donor_ata.to_account_info(),
          to:ctx.accounts.vault.to_account_info(),
          authority:ctx.accounts.signer.to_account_info(),
        },
      ),
      amount,
    )?;

    campaign.amount_raised+=amount;
    Ok(())
  }
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct Campaign<'info>{
  #[account(
    init,
    payer=signer,
    space=CampaignState::INIT_SPACE,
    seeds=[b"campaign",owner.key().as_ref(),title.as_bytes()],
    bump
  )]
  pub campaign:Account<'info,CampaignState>,
  #[account(mut)]
  pub signer:Signer<'info>,
  pub owner:SystemAccount<'info>,
  pub mint:InterfaceAccount<'info,Mint>,
  #[account(
    init,
    payer=signer,
    associated_token::mint=mint,
    associated_token::authority=campaign,
  )]
  pub vault:InterfaceAccount<'info,TokenAccount>,
  pub system_program:Program<'info,System>,
  pub token_program:Interface<'info,TokenInterface>,
  pub associated_token_program:Program<'info,AssociatedToken>,
}

#[derive(Accounts)]
pub struct Donate<'info>{
  #[account(
    init_if_needed,
    payer=signer,
    space=8+DonorState::INIT_SPACE,
    seeds=[b"donor",signer.key().as_ref(),campaign.key().as_ref()],
    bump

  )]
  pub donor_acc:Account<'info,DonorState>,
  #[account(mut)]
  pub signer:Signer<'info>,
  #[account(mut)]
  pub campaign:Account<'info,CampaignState>,
  #[account(
    mut,
    associated_token::mint=campaign.mint,
    associated_token::authority=campaign,
  )]
  pub vault:InterfaceAccount<'info,TokenAccount>,
  #[account(
    mut,
    associated_token::mint=campaign.mint,
    associated_token::authority=signer
  )]
  pub donor_ata:InterfaceAccount<'info,TokenAccount>,
  pub token_program:Interface<'info,TokenInterface>,
  pub system_program:Program<'info,System>,
  pub associated_token_program:Program<'info,AssociatedToken>

}
#[account]
#[derive(InitSpace)]
pub struct DonorState{
  pub donor_pubkey:Pubkey,
  pub amount:u64,
}


#[account]
#[derive(InitSpace)]
pub struct CampaignState{
  pub owner:Pubkey,
  #[max_len(50)]
  pub title:String,
  pub start_time:i64,
  pub deadline:i64,
  pub amount_raised:u64,
  pub mint:Pubkey,
  pub vault:Pubkey,
  pub bump:u8,
}

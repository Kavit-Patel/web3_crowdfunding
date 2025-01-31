#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use anchor_spl::{
  associated_token::AssociatedToken,
  token_interface::{Mint,TokenAccount,TokenInterface}
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

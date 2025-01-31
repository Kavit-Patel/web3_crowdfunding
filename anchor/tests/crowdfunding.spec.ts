import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey, SystemProgram} from '@solana/web3.js'
import {Crowdfunding} from '../target/types/crowdfunding'
import { ASSOCIATED_TOKEN_PROGRAM_ID, createMint, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import assert from 'assert'

describe('crowdfunding', () => {
  
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const connection = provider.connection
  const payer = provider.wallet as anchor.Wallet
  const program = anchor.workspace.Crowdfunding as Program<Crowdfunding>

  let campaignOwner=Keypair.generate()
  let mintOwner=Keypair.generate()
  let title="Protect the Sea"
  let start_time = new anchor.BN(Date.now() / 1000);
  let deadline = new anchor.BN(Date.now() / 1000 + 86400);

  let mint:PublicKey;
  let vault:PublicKey;
  let campaignPda:PublicKey;
  let bump:number;

  beforeAll(async()=>{
    await connection.confirmTransaction(
    await connection.requestAirdrop(campaignOwner.publicKey, 1_000_000_000));

    await connection.confirmTransaction(
    await connection.requestAirdrop(mintOwner.publicKey, 1_000_000_000));


    [campaignPda,bump]=PublicKey.findProgramAddressSync([
      Buffer.from("campaign"),
      campaignOwner.publicKey.toBuffer(),
      Buffer.from(title)
    ],
    program.programId
    );
    mint = await createMint(connection,mintOwner,mintOwner.publicKey,null,9);
    vault = anchor.utils.token.associatedAddress({
      mint: mint,
      owner: campaignPda,
      });

  })
  it('Create Campaign', async () => {

    const creteCampaignTX = await program.methods.createCampaign(title,start_time,deadline)
      .accounts({
        campaign:campaignPda,
        signer:payer.publicKey,
        owner:campaignOwner.publicKey,
        mint,
        vault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,


      } as any)
      .rpc()

      console.log("campaing PDA ",campaignPda.toString())
      const campaignAccount = await program.account.campaignState.fetch(campaignPda)
      console.log("campaing title ",campaignAccount.title.toString())
      console.log("campaing start ",campaignAccount.startTime)
      console.log("campaing deadline ",campaignAccount.deadline)
      console.log("campaing mint ",campaignAccount.mint.toBase58())
      console.log("campaing owner ",campaignAccount.owner.toBase58())
      console.log("campaing vault ",campaignAccount.vault.toBase58())
      assert.strictEqual(campaignAccount.title, title);
      assert.strictEqual(campaignAccount.owner.toString(), campaignOwner.publicKey.toString());
  })

})

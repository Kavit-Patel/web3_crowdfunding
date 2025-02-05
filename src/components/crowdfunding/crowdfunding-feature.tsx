'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { AppHero } from '../ui/ui-layout'
import {  useExistingAccount } from './crowdfunding-data-access'
import { CrowdfundingCard, CrowdfundingCreate } from './crowdfunding-ui'

export default function CrowdfundingFeature() {
  const {campaignAccountQuery}=useExistingAccount()
  const wallet = useWallet()

  return wallet && wallet.connected  && wallet.publicKey ? (
    <div>
      {!campaignAccountQuery.isPending && !campaignAccountQuery.data &&
      <AppHero
        title="Crowdfunding"
        subtitle={
          'Create Crowd funding'
        }
      >

         <CrowdfundingCreate wallet = {wallet} />
      </AppHero>}
      {campaignAccountQuery.isPending && <div className='w-screen h-screen flex justify-center items-center '><div className="loading loading-spinner loading-lg "></div></div>}
     {campaignAccountQuery.data &&  <CrowdfundingCard existingCampaign = {campaignAccountQuery.data}/>}
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}

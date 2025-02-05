'use client'

import {  useCrowdfundingProgram } from './crowdfunding-data-access'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { ICampaign } from './types'
import { formatDate } from '../common/common-utils'
import { useCreateMintAndTokenAccount } from '../mint/mint-data-access'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'


export function CrowdfundingCreate({wallet}:{wallet:WalletContextState}) {
  const { createCampaign } = useCrowdfundingProgram()
  const {createMintAndTokenAccount}=useCreateMintAndTokenAccount()
  const router = useRouter()
  const handleCreateCampaign = async()=>{
    const {signature,mint,associatedTokenAccount} = await createMintAndTokenAccount.mutateAsync({walletAdapter:wallet,tokenAmount:1000})
    await createCampaign.mutateAsync({wallet,startTime:1738589584,deadline:1739589584,mint })
    .then(()=>router.push('/donate'))
    .catch(()=>toast.error("Campaign Creation failed !"))
  }
  return (
    <button
      className="btn btn-xs lg:btn-md btn-primary"
      onClick={handleCreateCampaign}
      disabled={createCampaign.isPending}
    >
      Create {createCampaign.isPending && '...'}
    </button>
  )
}

export function CrowdfundingCard({existingCampaign}:{existingCampaign:ICampaign}) {

  const startTime =formatDate( new Date(existingCampaign.startTime.toNumber() * 1000));
  const deadline = formatDate(new Date(existingCampaign.deadline.toNumber() * 1000));


  return  existingCampaign ? (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200 text-center">
        {existingCampaign.title}
      </h2>
      
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1.5">
          <span className="font-semibold">Owner:</span> {existingCampaign.owner.toBase58()}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1.5">
          <span className="font-semibold">Mint:</span> {existingCampaign.mint.toBase58()}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1.5">
          <span className="font-semibold">Vault:</span> {existingCampaign.vault.toBase58()}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Start Date</p>
          <p className="text-base font-semibold text-gray-700 dark:text-gray-100">{startTime}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">End Date</p>
          <p className="text-base font-semibold text-gray-700 dark:text-gray-100">{deadline}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Amount Raised</p>
        <p className="text-xl font-bold text-green-600">
          {(Number(existingCampaign.amountRaised)/10**9).toFixed(2)}
        </p>
      </div>
      <div className="mb-4 text-center">
        <Link href="/donate"  className="text-lg px-4 py-1 rounded-md bg-green-800 transition-all hover:bg-green-900 active:scale-95 font-medium text-gray-500 dark:text-gray-300">Donate Now</Link>
      </div>
    </div>
  ):(
    <div>Campaign hasn't Created yet !</div>
  )
}

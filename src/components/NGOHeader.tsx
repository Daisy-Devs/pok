"use client"
import { nomenclature } from '@/src/constants/nomenclature'
import { Bell, WalletIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface NGOHeaderProps {
    isLoggedIn: boolean,
    pageTitle: string,
    walletAddress: string
}
const NGOHeader:React.FC<NGOHeaderProps> = ({isLoggedIn,pageTitle,walletAddress}) => {
  return (
    isLoggedIn ? <div className='flex justify-between p-5'>
        <h3 className='text-2xl font-extrabold'>{pageTitle}</h3>
        <div className='flex justify-center items-center'>
            <Bell size={20} color='#45464D' />
            <div className='flex gap-1.5 mx-2 p-2.5 bg-background-secondary rounded-full justify-center items-center'>
                <WalletIcon size={20} color='#4648D4' />
                <p className='font-semibold text-sm'>{walletAddress}</p>
            </div>
        </div>
    </div> : <div className='flex p-5'>        <Link href="/">
          <p className="text-xl font-extrabold text-tertiary">
            {nomenclature.PRODUCT_NAME.replaceAll(" ", "")}
          </p>
        </Link></div>
  )
}

export default NGOHeader
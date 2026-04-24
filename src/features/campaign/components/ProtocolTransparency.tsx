"use client"
import { StatCard } from '@/src/components/StatCard'
import { nomenclature } from '@/src/constants/nomenclature'
import { HouseHeart, Scroll, ScrollText } from 'lucide-react'
import React from 'react'

const ProtocolTransparency = () => {
  return (
        <div className='flex flex-col gap-10 w-full md:px-6'>
        <h2 className='font-bold text-3xl self-center mb-6 px-6'>{nomenclature.PROTOCOL_TRANSPARENCY}</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 w-full gap-4'>
        <StatCard value='Smart Contracts' label={'Verified on Etherscan for complete fund autonomy.'} icon={<div className='p-3.5 flex items-center justify-center rounded-full bg-primary-light'><ScrollText className='w-4 h-4' color='#4648D4' /></div>}/>
        <StatCard value='0% Platform Fee' label={'100% of your crypto reaches the community directly.'} icon={<div className='p-3.5 flex items-center justify-center rounded-full bg-[#DAE2FD]'><HouseHeart className='w-4 h-4' color='#3F465C' /></div>}/>
        <StatCard value='NFT Impact Receipt' label={'Receive a dynamic NFT tracking your personal impact.'} icon={<div className='p-3.5 flex items-center justify-center rounded-full bg-primary-light'><Scroll className='w-4 h-4' color='#4648D4' /></div>}/>
        </div>
        </div>
  )
}

export default ProtocolTransparency
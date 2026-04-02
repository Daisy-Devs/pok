"use client"
import React from 'react'
import { DonationActivity, UserType } from '../types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table'
import { ChevronRight, EyeOff, UserIcon } from 'lucide-react'
import { timeAgo } from '@/src/lib/utils'

const LiveDonationActivity = () => {
    const donationActivities:DonationActivity[] = [
        {
        id:'aahh88',
        donorName:'Pranita Singh',
        amount: 0.5,
        timestamp: '2024-06-01T12:34:56Z',
        etherScanLink: 'https://etherscan.io/tx/0x1234567890abcdef'
        },
        {
        id:'aahh89',
        donorName:'Anonymous',
        amount: 1,
        timestamp: '2024-06-01T12:34:56Z',
        etherScanLink: 'https://etherscan.io/tx/0x1234567890abcdef'
        },
        {
        id:'aahh90',
        donorName:'Suchi khan',
        amount: 0.2,
        timestamp: '2024-06-01T12:34:56Z',
        etherScanLink: 'https://etherscan.io/tx/0x1234567890abcdef'
        },
        {
        id:'aahh91',
        donorName:'Hitanshi kumar',
        amount: 0.73,
        timestamp: '2024-06-01T12:34:56Z',
        etherScanLink: 'https://etherscan.io/tx/0x1234567890abcdef'
        },
    ]
  return (
    <div>
        <h2 className='text-3xl font-extrabold text-secondaryText mb-8'>Live Donation Activity</h2>
        <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-110">Donor</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {donationActivities.map((activity) => (
          <TableRow key={activity.id}>
            <TableCell className="font-medium">{<User name={activity.donorName} isAnonymous={activity.donorName === 'Anonymous'} />}</TableCell>
            <TableCell className='font-semibold text-secondaryText text-base'>{activity.amount}</TableCell>
            <TableCell>{timeAgo(activity.timestamp)}</TableCell>
            <TableCell><a href={activity.etherScanLink} target="_blank" rel="noopener noreferrer"><ChevronRight size={12}/></a></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  )
}

const User = ({name, isAnonymous}: UserType) => {
  return (
    <div className='flex items-center gap-2'>
      <div className={`flex justify-center items-center w-8 h-8 rounded-full ${isAnonymous ? 'bg-muted' : 'bg-primary-light'}`}>
        {isAnonymous ? <EyeOff size={16} className='text-primaryColor'/> : <UserIcon size={16} className='text-primary'/>}
      </div>
      <span className={`font-semibold ${isAnonymous ? 'text-muted-foreground' : 'text-primaryText'}`}>{isAnonymous ? 'Anonymous' : name}</span>
    </div>
  )
}
export default LiveDonationActivity
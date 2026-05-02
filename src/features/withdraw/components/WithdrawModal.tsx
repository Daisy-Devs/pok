"use client"
import { Button } from '@/src/components/ui/button'
import React, { FC } from 'react'

type WithdrawModalProps = {
  campaignId: string
  campaignName: string
  balance: string
  category: string
}
const WithdrawModal:FC<WithdrawModalProps> = () => {
  return (
    <Button>Withdraw</Button>
  )
}

export default WithdrawModal
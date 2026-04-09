"use client"
import { Button } from '@/src/components/ui/button'
import { nomenclature } from '@/src/constants/nomenclature'
import { WalletIcon } from 'lucide-react'

const NGOSignIn = () => {
  return (
    <div className='flex flex-col justify-center items-center bg-background'>
        <div className="bg-card rounded-2xl shadow-md p-8 max-w-md text-center flex flex-col items-center">
        
        <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-xl bg-background-secondary">
          <WalletIcon size={20} color='#4648D4' />
        </div>

        <h1 className="text-2xl font-extrabold text-tertiary">
          {nomenclature.ORGANIZATION_LOGIN}
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          {nomenclature.ORGANIZATION_LOGIN_DESCRIPTION}
        </p>

       <Button text='Sign In with Metamask' size={'lg'} leftIcon={<WalletIcon size={20} color='#FFFFFF' />} className="mt-6"/>

        <div className="mt-6 bg-background-secondary w-xs rounded-lg p-4 text-sm text-foreground">
          {nomenclature.NEW_TO_POK+" "}<br/>
          <span className="text-primary cursor-pointer hover:underline">
           {nomenclature.SIGN_IN}
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 text-center text-xs text-foreground">
        <div className="flex justify-center gap-4 mb-1">
          <span>{nomenclature.SOC_2_COMPLIANT}</span>
          <span>{nomenclature.END_TO_END_ENCRYPTED}</span>
        </div>
        <p>{nomenclature.COPYRIGHT}</p>
      </div>
    </div>
  )
}

export default NGOSignIn
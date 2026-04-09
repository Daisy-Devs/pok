import ResetForm from '@/src/features/auth/components/ResetForm'
import React from 'react'

interface ResetPasswordProps {
    params:{token:string}
}
const ResetPassword:React.FC<ResetPasswordProps> = async({params}:ResetPasswordProps) => {
    const {token} = await params
   return(
    <ResetForm token={token}/>
   )
}

export default ResetPassword
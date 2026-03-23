import { nomenclature } from '@/src/constants/nomenclature'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className={'h-15'}>
    <Link href={'/'}><h2 className={'text-xl'}>{nomenclature.PROUDUCT_NAME}</h2></Link>
    </div>
  )
}

export default Navbar
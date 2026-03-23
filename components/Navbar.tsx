"use client"

import { nomenclature } from '@/src/constants/nomenclature'
import { Bell, UserCircle2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'

const Navbar = () => {
    const isLoggedIn = true
     const pathname = usePathname();
  return (
    <div className="h-16 px-6 flex items-center justify-between">

      {/* Logo */}
      <Link href="/">
        <p className="text-xl font-extrabold text-tertiary">
          {nomenclature.PRODUCT_NAME}
        </p>
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        <Link href="/" className={`text-sm font-normal hover:underline underline-offset-4 ${pathname === '/' && 'underline decoration-primary decoration-wavy decoration-3'}`}>
          {nomenclature.HOME}
        </Link>
        <Link href="/explore" className={`text-sm font-normal hover:underline underline-offset-8 ${pathname === '/explore' && 'underline decoration-primary decoration-wavy decoration-3'}`}>
          {nomenclature.EXPLORE_CAMPAIGNS}
        </Link>
        <Link href="/about" className={`text-sm hover:underline underline-offset-8 ${pathname === '/about' && 'underline decoration-primary decoration-wavy decoration-3'}`}>
          {nomenclature.ABOUT_US}
        </Link>
      </div>
  {  isLoggedIn ?
    /**  Icons **/
      <div className="flex items-center gap-4">
        <Bell size={20} className="cursor-pointer" />
        <UserCircle2 size={20} className="cursor-pointer" />
      </div>
      :
      <div className="flex items-center gap-4">
        <Link href="/" className="text-sm hover:underline">
          <Button text={nomenclature.NGO_PORTAL}/>
        </Link>
        <Link href="/" className="text-sm hover:underline">
          <Button text={nomenclature.SIGN_IN}/>
        </Link>
      </div>
}
    </div>
  )
}

export default Navbar

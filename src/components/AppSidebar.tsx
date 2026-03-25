"use client";
import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from './ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { nomenclature } from '@/src/constants/nomenclature';

const AppSidebar = () => {
    const pathname = usePathname();
  return (
        <Sidebar className='md:hidden'>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
           <div className="flex flex-col items-center gap-6">
        <Link
          href="/"
          className={`text-sm hover:underline underline-offset-8 ${
            pathname === "/" && "underline decoration-primary decoration-3"
          }`}
        >
          {nomenclature.HOME}
        </Link>

        <Link
          href="/explore"
          className={`text-sm hover:underline underline-offset-8 ${
            pathname === "/explore" &&
            "underline decoration-primary decoration-3"
          }`}
        >
          {nomenclature.EXPLORE_CAMPAIGNS}
        </Link>

        <Link
          href="/about"
          className={`text-sm hover:underline underline-offset-8 ${
            pathname === "/about" &&
            "underline decoration-primary decoration-3"
          }`}
        >
          {nomenclature.ABOUT_US}
        </Link>
      </div>
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
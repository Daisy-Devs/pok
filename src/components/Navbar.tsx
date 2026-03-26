"use client";

import { nomenclature } from "@/src/constants/nomenclature";
import { Bell, UserCircle2, Menu } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";


const Navbar = () => {
  const isLoggedIn = false;
  const pathname = usePathname();

  return (
    <div className="h-16 px-6 flex items-center justify-between border-b">
      
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden"/>
        <Link href="/">
          <p className="text-xl font-extrabold text-tertiary">
            {nomenclature.PRODUCT_NAME}
          </p>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-6">
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

      <div className="hidden md:flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Bell size={20} className="cursor-pointer" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <UserCircle2 size={20} className="cursor-pointer" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/">Connect Wallet</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link href="/">
              <Button variant={'outline'} text={nomenclature.NGO_PORTAL} />
            </Link>
            <Link href="/sign-in">
              <Button text={nomenclature.SIGN_IN} />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
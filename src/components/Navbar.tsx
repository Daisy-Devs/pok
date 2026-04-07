"use client";

import { nomenclature } from "@/src/constants/nomenclature";
import { Bell, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAppSelector } from "../store/store";
import { selectIsAuthenticated } from "../store/services/selectors/authSelectors";
import { useDispatch } from "react-redux";
import { loggedOut } from "../store/services/slice/authSlice";


const Navbar = () => {
  const isLoggedIn = useAppSelector(selectIsAuthenticated);
  const pathname = usePathname();
  const dispatch= useDispatch()
  const router = useRouter();
  return (
    <div className="h-16 px-6 flex items-center justify-between ring-2 ring-border bg-background">
      
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
          className={`font-semibold text-sm hover:underline underline-offset-8 ${
            pathname === "/" && "text-primary underline decoration-primary decoration-3"
          }`}
        >
          {nomenclature.HOME}
        </Link>

        <Link
          href="/explore"
          className={`font-semibold text-sm hover:underline underline-offset-8 ${
            pathname === "/explore" &&
            "text-primary underline decoration-primary decoration-3"
          }`}
        >
          {nomenclature.EXPLORE_CAMPAIGNS}
        </Link>

        <Link
          href="/about"
          className={`font-semibold text-sm hover:underline underline-offset-8 ${
            pathname === "/about" &&
            "text-primary underline decoration-primary decoration-3"
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
                <DropdownMenuItem className="text-red-500" onClick={()=>{dispatch(loggedOut())
                  router.push("/sign-in")
                }}>
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
"use client";

import { nomenclature } from "@/src/constants/nomenclature";
import { Bell, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAppSelector } from "../store/store";
import { selectIsAuthenticated, selectUser } from "../store/services/selectors/authSelectors";
import { useDispatch } from "react-redux";
import { loggedOut } from "../store/services/slice/authSlice";
import { useDonorLogoutMutation } from "../store/services/api/donorAuthApi";
import { toast } from "sonner";
import { useDisconnectWalletMutation } from "../store/services/api/walletApi";
import { useConnection, useDisconnect } from "wagmi";
import { useWalletConnectHandler } from "../features/auth/hooks/useWalletConnect";
import { splitTitle } from "../lib/utils";
import { googleLogout } from "@react-oauth/google";
import { apiSlice } from "../store/services/slice/apiSlice";

const Navbar = () => {
  const {handleWalletConnect}=useWalletConnectHandler();
  const { isConnected } = useConnection();
  const { mutate } = useDisconnect();
  const user = useAppSelector(selectUser);
  const authenticated = useAppSelector(selectIsAuthenticated);
  const isLoggedIn = authenticated && user?.role === "Donor";
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const [donorLogout, { isLoading: logoutLoading }] = useDonorLogoutMutation();
  const [disconnectWallet, { isLoading: disconnectWalletLoading }] =
    useDisconnectWalletMutation();
  const{firstHalf,secondHalf}=splitTitle(nomenclature.PRODUCT_NAME);
  
const handleLogout = async () => {
  try {
    if (isConnected) {
      try {
        const walletRes = await disconnectWallet({}).unwrap();
        mutate();
        console.log("wallet disconnected", walletRes);
      } catch (err) {
        console.log(err);
        toast.error("Wallet disconnection failed");
      }
    }
    await donorLogout({}).unwrap();
    dispatch(apiSlice.util.resetApiState());
    dispatch(loggedOut());
    googleLogout();
    toast.success("You've been logged out");

  } catch (err) {
    console.log(err);
    toast.error("Logout failed");
  }
};
  return (
    <div className="h-16 px-6 flex items-center justify-between ring-2 ring-border bg-background">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="flex">
          <p className="text-xl font-extrabold text-tertiary">
            {firstHalf}
          </p>
          <p className="text-xl font-extrabold text-primary">
            {secondHalf.replace(/\s/g, "")}
          </p>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/"
          className={`font-semibold text-sm hover:underline underline-offset-8 ${
            pathname === "/" &&
            "text-primary underline decoration-primary decoration-3"
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
                  <Link href="/profile">View Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleWalletConnect}>
                  {isConnected && isLoggedIn ? "Disconnect Wallet" : "Connect Wallet"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link href="/ngo/sign-in">
              <Button variant={"outline"} text={nomenclature.NGO_PORTAL} />
            </Link>
         {pathname!=='/sign-in' && (
            <Link href="/sign-in">
              <Button text={nomenclature.SIGN_IN} />
            </Link>
          )}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;

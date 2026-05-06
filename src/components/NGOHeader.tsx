"use client";
import { nomenclature } from "@/src/constants/nomenclature";
import { WalletIcon } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useWalletLogoutMutation } from "../store/services/api/walletApi";
import { toast } from "sonner";
import { loggedOut } from "../store/services/slice/authSlice";
import { useDisconnect } from "wagmi";
import { useAppSelector } from "../store/store";
import { selectIsAuthenticated, selectUser } from "../store/services/selectors/authSelectors";
import { splitTitle } from "../lib/utils";
import { apiSlice } from "../store/services/slice/apiSlice";

interface NGOHeaderProps {
  walletAddress: string;
}
const NGOHeader: React.FC<NGOHeaderProps> = ({ walletAddress }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const path = usePathname();
  const [walletLogout] = useWalletLogoutMutation();
  const {mutate:disconnectWallet}=useDisconnect();
  const authenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const isLoggedIn = authenticated && user?.role === "NGO";
  let pageTitle="";
  switch (path) {
    case "/ngo":
      pageTitle = "Dashboard Overview";
      break;
    case "/ngo/causes":
      pageTitle = "Active Causes";
      break;
    case "/ngo/donation-history":
      pageTitle = "Donation History";
      break;
    case "/ngo/withdraw":
      pageTitle = "Withdraw Funds";
      break;
    case "/ngo/new-cause":
      pageTitle = "Create a New Cause";
      break;
    default:
      pageTitle = "Dashboard Overview";
  }
  const{firstHalf,secondHalf}=splitTitle(nomenclature.PRODUCT_NAME);

  const handleLogout = async () => {
    try{
    const res = await walletLogout({}).unwrap();
    disconnectWallet();
    console.log("logged out", res);
    dispatch(loggedOut());
    dispatch(apiSlice.util.resetApiState());
    router.replace("/ngo/sign-in");
    toast.success("Logout successful");
    }catch(err){
      console.log("logout error", err);
      toast.error("Logout failed");
    }
  };
  return (
    <div className="flex justify-between p-5">
      {isLoggedIn?<h4 className="text-2xl font-extrabold">{pageTitle}</h4>:
     (
      <div className="flex">
      <h3 className="text-2xl font-extrabold">{firstHalf}</h3>
      <h3 className="text-2xl font-extrabold text-primary">{secondHalf.replace(" ","")}</h3>
      </div>
      )
  }
    {isLoggedIn && (
      <div className="flex justify-center items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex gap-1.5 mx-2 p-2.5 bg-background-secondary rounded-full justify-center items-center">
              <WalletIcon size={20} color="#4648D4" />
              <p className="font-semibold text-sm">{walletAddress}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => {
                handleLogout();
              }}
            >
              {nomenclature.SIGN_OUT}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>)}
    </div>
  );
};

export default NGOHeader;

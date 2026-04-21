"use client";
import { nomenclature } from "@/src/constants/nomenclature";
import { Bell, WalletIcon } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useWalletLogoutMutation } from "../store/services/api/walletApi";
import { toast } from "sonner";
import { loggedOut } from "../store/services/slice/authSlice";
import { useDisconnect } from "wagmi";
import { useAppSelector } from "../store/store";
import { selectIsAuthenticated } from "../store/services/selectors/authSelectors";

interface NGOHeaderProps {
  pageTitle: string;
  walletAddress: string;
}
const NGOHeader: React.FC<NGOHeaderProps> = ({ pageTitle, walletAddress }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [walletLogout] = useWalletLogoutMutation();
  const {mutate:disconnectWallet}=useDisconnect();
  const isLoggedIn = useAppSelector(selectIsAuthenticated);
  const handleLogout = async () => {
    try{
    const res = await walletLogout({}).unwrap();
    disconnectWallet();
    console.log("logged out", res);
    dispatch(loggedOut());
    router.replace("/ngo/sign-in");
    toast.success("Logout successful");
    }catch(err){
      console.log("logout error", err);
      toast.error("Logout failed");
    }
  };
  return (
    <div className="flex justify-between p-5">
      <h3 className="text-2xl font-extrabold">{isLoggedIn?pageTitle:nomenclature.PRODUCT_NAME}</h3>
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

"use client";
import { Button } from "@/src/components/ui/button";
import { nomenclature } from "@/src/constants/nomenclature";
import { useWalletLoginMutation } from "@/src/store/services/api/walletApi";
import { loggedIn } from "@/src/store/services/slice/authSlice";
import { WalletIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
  useSignMessage,
} from "wagmi";

const NGOSignIn = () => {
  const { isConnected } = useConnection();
  const { mutate } = useConnect();
  const connectors = useConnectors();
  const [walletLogin, { isLoading }] = useWalletLoginMutation();
  const { mutate: disconnect } = useDisconnect();
  const dispatch = useDispatch();
  const router = useRouter();
  const { mutateAsync: signMessage } = useSignMessage();
  const message = `An orange fox jumped the fence at ${new Date().toISOString()}`;
  const handleWalletConnect = async () => {
    if (isConnected) {
      disconnect();
      return;
    }
    mutate(
      { connector: connectors[0] },
      {
        onSuccess: async (data) => {
          const signature = await signMessage({ message });

          console.log(data);
          walletLogin({
            walletAddress: data.accounts[0],
            signature,
            message,
          })
            .unwrap()
            .then((res) => {
              console.log("wallet login response:", res);
              dispatch(
                loggedIn({
                  name: res.data.ngo.name,
                  email: res.data.ngo.email,
                  role: "NGO",
                }),
              );
              router.replace("/ngo");
            });
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to connect wallet");
        },
      },
    );
  };
  return (
    <div className="flex flex-col justify-center items-center bg-background">
      <div className="bg-card rounded-2xl shadow-md p-8 max-w-md text-center flex flex-col items-center">
        <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-xl bg-background-secondary">
          <WalletIcon size={20} color="#4648D4" />
        </div>

        <h1 className="text-2xl font-extrabold text-tertiary">
          {nomenclature.ORGANIZATION_LOGIN}
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          {nomenclature.ORGANIZATION_LOGIN_DESCRIPTION}
        </p>

        <Button
          onClick={handleWalletConnect}
          text="Sign In with Metamask"
          size={"lg"}
          disabled={isLoading}
          leftIcon={
            <Image src="/metamask.svg" width={25} height={25} alt="metamask" />
          }
          className="mt-6"
        />

        <div className="mt-6 bg-background-secondary w-xs rounded-lg p-4 text-sm text-foreground">
          {nomenclature.NEW_TO_POK + " "}
          <br />
          <Link href="/ngo/register">
            <span className="text-primary cursor-pointer hover:underline">
              {nomenclature.SIGN_UP}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NGOSignIn;

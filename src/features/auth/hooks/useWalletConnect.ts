import { useConnect, useConnection, useConnectors, useDisconnect } from "wagmi";
import { useConnectWalletMutation } from "@/src/store/services/api/walletApi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useWalletConnectHandler = () => {
  const { isConnected } = useConnection();
  const { mutate } = useConnect();
  const connectors = useConnectors();
  const { mutate: disconnect } = useDisconnect();
  const [connectWallet, { isLoading }] = useConnectWalletMutation();

  const dispatch = useDispatch();
  const router = useRouter();

  const handleWalletConnect = () => {
    if (isConnected) {
      disconnect();
      return;
    }

    mutate(
      { connector: connectors[0] },
      {
        onSuccess: (data) => {
          connectWallet({
            walletAddress: data.accounts[0],
          }).then(() => {
            toast.success("Wallet connected successfully");
            
          });
        },
        onError: (err) => {
          console.error(err);
        },
      }
    );
  };

  return { handleWalletConnect, isConnected, isLoading };
};
import { Button } from "@/src/components/ui/button";
import { walletConfig } from "@/src/lib/walletConfig";
import { useAccount, useSwitchChain } from "wagmi";
import FormTitle from "./FormTitle";
import { nomenclature } from "@/src/constants/nomenclature";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { NgoRegistrationFormData } from "../types";
import {
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
  useSignMessage,
} from "wagmi";
import { useWalletLoginMutation } from "@/src/store/services/api/walletApi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { loggedIn } from "@/src/store/services/slice/authSlice";
import { useRegisterNgoMutation } from "@/src/store/services/api/campaignApi";
import { toast } from "sonner";

interface RegistrationForm3Props {
  changeStep: (step: string) => void;
  ngoData: NgoRegistrationFormData;
}
const RegistrationForm3: React.FC<RegistrationForm3Props> = ({
  changeStep,
  ngoData,
}) => {
  const { mutate } = useConnect();
  const { mutate: disconnect } = useDisconnect();
  const connectors = useConnectors();
  const { mutateAsync: signMessage } = useSignMessage();
  const message = `An orange fox jumped the fence at ${new Date().toISOString()}`;
  const [walletLogin, { isLoading, error: walletLoginError }] =
    useWalletLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [registerNgo, { isLoading: registerNgoLoading }] =
    useRegisterNgoMutation();

  const handleWalletConnect = async () => {
    if (isConnected) {
      disconnect();
      return;
    }

    const connector = connectors[0];

    if (!connector) {
      toast.error("Wallet connector not ready yet");
      return;
    }
    mutate(
      {
        connector,
        chainId: 11155111, // ✅ force Sepolia
      },
      {
        onSuccess: () => {
          toast.success("Wallet connected on Sepolia");
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to connect wallet");
        },
      },
    );
  };

  const { isConnected, address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const ensureSepolia = async () => {
    if (typeof window === "undefined") return;

    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      toast.error("MetaMask not found");
      return;
    }

    try {
      // Try switching
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // 11155111 in hex
      });
    } catch (switchError: any) {
      // If Sepolia not added → add it
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia",
                nativeCurrency: {
                  name: "Sepolia ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: [
                  `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
                ],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } catch (addError) {
          console.error("Add chain failed", addError);
          toast.error("Failed to add Sepolia network");
        }
      } else {
        console.error("Switch failed", switchError);
        toast.error("Please switch network manually");
      }
    }
  };
  const handleNGORegistration = async () => {
    if (!isConnected) {
      toast.warning("Please connect your wallet");
      return;
    }
    await ensureSepolia();
    if (chainId !== 11155111) {
      toast.error("Please switch to Sepolia network in MetaMask");
      return;
    }

    await new Promise((r) => setTimeout(r, 800));

    const signature = await signMessage({ message });
    console.log({
      walletAddress: address,
      signature,
      message,
    });

    if (isConnected) {
      walletLogin({
        walletAddress: address,
        signature,
        message,
      })
        .unwrap()
        .then((res) => {
          console.log("wallet login response:", res);
          const updatedNgoData = {
            ...ngoData,
            profileImage: {
              url: ngoData.profileImage.url,
              public_id: ngoData.profileImage.public_id,
            },
          };
          if (chainId !== 11155111) {
            toast.error("Still not on Sepolia. Please switch manually.");
            return;
          }

          registerNgo(updatedNgoData)
            .unwrap()
            .then((ngoresponse) => {
              dispatch(
                loggedIn({
                  name: ngoData.organizationName,
                  email: ngoData.email,
                  role: "NGO",
                }),
              );
              console.log("register ngo response:", ngoresponse);
              router.replace("/ngo");
            })
            .catch((err) => {
              toast.error("Failed to register NGO");
              console.log("ngo registration error:", err, walletLoginError);
            });
        })
        .catch((err) => {
          console.log("wallet login error:", err);
        });
    } else {
      toast.warning("Please connect your wallet to continue");
    }
  };
  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <FormTitle
        title={nomenclature.WALLET_SETUP}
        description={nomenclature.WALLET_SETUP_DESCRIPTION}
      />

      <Button
        size={"default"}
        className="p-6 text-base"
        variant="grey"
        text="Metamask"
        onClick={handleWalletConnect}
        disabled={isConnected}
        leftIcon={
          <Image src="/metamask.svg" width={25} height={25} alt="metamask" />
        }
        rightIcon={<ChevronRight size={16} color="#45464D" />}
      />

      <div className="flex justify-between items-center pt-4">
        <Button
          text="Back"
          variant="ghost"
          onClick={() => changeStep("2")}
          leftIcon={<ArrowLeft size={16} color="#45464D" />}
        />
        <Button text="Continue" onClick={handleNGORegistration} />
      </div>
    </div>
  );
};

export default RegistrationForm3;

import { Button } from "@/src/components/ui/button";
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
import { useWalletLoginMutation, useWalletLogoutMutation } from "@/src/store/services/api/walletApi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { loggedIn, loggedOut } from "@/src/store/services/slice/authSlice";
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
  const { isConnected, address } = useConnection();
  const connectors = useConnectors();
  const { mutateAsync: signMessage } = useSignMessage();
  const message = `An orange fox jumped the fence at ${new Date().toISOString()}`;
  const [walletLogin, { isLoading, error: walletLoginError }] =
    useWalletLoginMutation();
    const [walletLogout]=useWalletLogoutMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [registerNgo, { isLoading: registerNgoLoading }] =
    useRegisterNgoMutation();
  const handleWalletConnect = async () => {
    if (isConnected) {
      disconnect();
      return;
    }
    mutate(
      { connector: connectors[0] },
      {
        onSuccess: (data) => {
          console.log(data);
          toast.success("Wallet connected successfully");
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to connect wallet");
        },
      },
    );
  };
  const handleNGORegistration = async () => {
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
            profileImage:{url:ngoData.profileImage.url,public_id:ngoData.profileImage.public_id},
          };
          
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
              walletLogout({});
              dispatch(loggedOut());
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
          <Image src="/svg/metamask.svg" width={25} height={25} alt="metamask" />
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
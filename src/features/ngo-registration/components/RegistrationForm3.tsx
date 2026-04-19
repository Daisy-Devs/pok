import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/src/components/ui/button";
import FormTitle from "./FormTitle";
import { nomenclature } from "@/src/constants/nomenclature";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { NgoRegistrationFormData } from "../types";
import { useConnect, useConnection, useConnectors, useDisconnect } from "wagmi";
import { useWalletLoginMutation } from "@/src/store/services/api/walletApi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { loggedIn } from "@/src/store/services/slice/authSlice";
import { useRegisterNgoMutation } from "@/src/store/services/api/campaignApi";

interface RegistrationForm3Props {
  changeStep: (step: string) => void;
  ngoData: NgoRegistrationFormData;
  updateNgoData: Dispatch<SetStateAction<NgoRegistrationFormData>>;
}
const RegistrationForm3: React.FC<RegistrationForm3Props> = ({
  changeStep,
  ngoData,
  updateNgoData,
}) => {
  const { mutate } = useConnect();
  const { mutate: disconnect } = useDisconnect();
  const { isConnected,address } = useConnection();
  const connectors = useConnectors();
  const [walletLogin, { isLoading }] = useWalletLoginMutation();
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
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
  };
  const handleNGORegistration = async () => {
          const updatedData = { ...ngoData, walletAddress: address };
          updateNgoData(updatedData);
          console.log("upd",updatedData);
          
          registerNgo(updatedData)
            .then((res) => {
              console.log("register ngo response:", res);
              walletLogin({
                walletAddress: address,
              }).then((res) => {
                console.log("wallet login response:", res);
                dispatch(
                  loggedIn({
                    name: ngoData.organizationName,
                    email: ngoData.email,
                    role: "NGO",
                  }),
                );
                router.replace("/ngo");
              }).catch((err) => {
                console.log("wallet login error:", err);
              });
            })
            .catch((err) => {
              console.log("register ngo error:", err);
            });
  }
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

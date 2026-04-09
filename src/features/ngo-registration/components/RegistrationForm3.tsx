import React from "react";
import { UploadBox } from "./UploadBox";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import FormTitle from "./FormTitle";
import { nomenclature } from "@/src/constants/nomenclature";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface RegistrationForm3Props {
  changeStep: (step: string) => void;
}
const RegistrationForm3: React.FC<RegistrationForm3Props> = ({
  changeStep,
}) => {
  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <FormTitle
        title={nomenclature.WALLET_SETUP}
        description={nomenclature.WALLET_SETUP_DESCRIPTION}
      />

      <Button size={'default'} className="p-6 text-base" variant="grey" text="Metamask" leftIcon={<Image src='/metamask.svg' width={25} height={25} alt='metamask' />} rightIcon={<ChevronRight size={16} color="#45464D" />}/>

      <div className="flex justify-between items-center pt-4">
        <Button
          text="Back"
          variant="ghost"
          onClick={() => changeStep("2")}
          leftIcon={<ArrowLeft size={16} color="#45464D" />}
        />
        <Button text="Continue" onClick={() => changeStep("3")} />
      </div>
    </div>
  );
};

export default RegistrationForm3;

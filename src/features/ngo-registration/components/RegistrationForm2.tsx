import React, { useState } from "react";
import { UploadBox } from "./UploadBox";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import FormTitle from "./FormTitle";
import { nomenclature } from "@/src/constants/nomenclature";
import { ArrowLeft } from "lucide-react";
import SelectCause from "./SelectCause";

interface RegistrationForm2Props {
  changeStep: (step: string) => void;
}
const RegistrationForm2: React.FC<RegistrationForm2Props> = ({
  changeStep,
}) => {
  const [selectedCause, setSelectedCause] = useState("Environment");
  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <FormTitle
        title={nomenclature.MISSION_DETAILS}
        description={nomenclature.MISSION_DETAILS_DESCRIPTION}
      />
      <Input placeholder="e.g. Global Health Initiative" />

      <Input placeholder={nomenclature.MISSION_STATEMENT_PLACEHOLDER} />

      <SelectCause setCause={setSelectedCause} cause={selectedCause} />
      <UploadBox
        fieldName="Cause/Campaign images"
        title="Upload Images"
        subtitle="JPG or PNG or WEBP (Max 2MB)"
        onlyImage={true}
      />

      <div className="flex justify-between items-center pt-4">
        <Button
          text="Back"
          variant="ghost"
          onClick={() => changeStep("1")}
          leftIcon={<ArrowLeft size={16} color="#45464D" />}
        />
        <Button text="Continue" onClick={() => changeStep("3")} />
      </div>
    </div>
  );
};

export default RegistrationForm2;

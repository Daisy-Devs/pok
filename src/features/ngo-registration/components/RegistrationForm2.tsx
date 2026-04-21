import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import FormTitle from "./FormTitle";
import { nomenclature } from "@/src/constants/nomenclature";
import { ArrowLeft } from "lucide-react";
import SelectCause from "./SelectCause";
import { UploadBox } from "@/src/components/UploadBox";
import { NgoRegistrationFormData } from "../types";
import { UploadDocumentType } from "@/src/constants/types";
import RichTextEditor from "@/src/components/RichTextEditor";


interface RegistrationForm2Props {
  changeStep: (step: string) => void;
  ngoData: NgoRegistrationFormData;
  updateNgoData: Dispatch<SetStateAction<NgoRegistrationFormData>>;
}
const RegistrationForm2: React.FC<RegistrationForm2Props> = ({
  changeStep,
  ngoData,
  updateNgoData,
}) => {

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <FormTitle
        title={nomenclature.MISSION_DETAILS}
        description={nomenclature.MISSION_DETAILS_DESCRIPTION}
      />
      <Input
        label="Cause/campaign title"
        value={ngoData.title}
        placeholder="e.g. Global Health Initiative"
        onChange={(e) =>
          updateNgoData((prev) => ({ ...prev, title: e.target.value }))
        }
      />

      <label htmlFor="mission-cause" className="text-xs font-semibold uppercase ">
        {nomenclature.MISSION_STATEMENT} <span className="text-destructive">*</span>
      </label>
      <RichTextEditor  value={ngoData.missionStatement} onChange={(value) => updateNgoData((prev) => ({ ...prev, missionStatement: value as string }))} />

      <Input
        label="Goal Amount"
        value={ngoData.goalAmount}
        placeholder={nomenclature.GOAL_AMOUNT}
        onChange={(e) =>
          updateNgoData((prev) => ({
            ...prev,
            goalAmount: Number(e.target.value),
          }))
        }
      />
      <p className="text-sm font-semibold text-primaryText uppercase">{nomenclature.CAUSE}</p>

      <SelectCause
        setCause={(cause) => updateNgoData((prev) => ({ ...prev, cause }))}
        cause={ngoData.cause}
      />
      <UploadBox
        fieldName="Cause/Campaign images"
        title="Upload Images"
        subtitle="JPG or PNG or WEBP (Max 2MB)"
        onlyImage={true}
        multifile={true}
        limit={5}
        value={ngoData.imageUrl}
        onChange={(files) =>
          updateNgoData((prev) => ({ ...prev, imageUrl: files as Array<UploadDocumentType> }))
        }
      />

      <div className="flex justify-between items-center pt-4">
        <Button
          text="Back"
          variant="ghost"
          onClick={() => changeStep("1")}
          leftIcon={<ArrowLeft size={16} color="#45464D" />}
        />
        <Button text="Continue" disabled={!ngoData.missionStatement||!ngoData.title||!ngoData.cause||!ngoData.imageUrl||!ngoData.goalAmount} onClick={() => changeStep("3")} />
      </div>
    </div>
  );
};

export default RegistrationForm2;

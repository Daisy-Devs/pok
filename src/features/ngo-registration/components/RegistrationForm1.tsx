import React from "react";
import { UploadBox } from "./UploadBox";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { DropdownMenu } from "@/src/components/ui/dropdown-menu";
import { nomenclature } from "@/src/constants/nomenclature";
import FormTitle from "./FormTitle";

interface RegistrationForm1Props {
    changeStep: (step: string) => void;
}
const RegistrationForm1: React.FC<RegistrationForm1Props> = ({changeStep}) => {
  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <FormTitle
        title={nomenclature.ORGANIZATION_DETAILS}
        description={nomenclature.ORGANIZATION_DETAILS_DESCRIPTION}
      />
      <Input placeholder="e.g. Global Health Initiative" />

      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="12-3456789" />
        <DropdownMenu />
      </div>

      <Input placeholder="https://www.organization.org" />

      <UploadBox
        fieldName="Company profile picture"
        title="Upload Profile picture"
        subtitle="JPG or PNG or WEBP (Max 2MB)"
        onlyImage={true}
      />

      <UploadBox
        fieldName="Supporting documents"
        title="Upload NGO Registration Certificate, Annual Reports & Financial Statements"
        subtitle="PDF, JPG or PNG (Max 10MB)"
        onlyImage={false}
      />

      <div className="flex justify-end items-center pt-4">
        <Button
          text="Continue to Mission"
          onClick={() => changeStep('2')}
        />
      </div>
    </div>
  );
};

export default RegistrationForm1;

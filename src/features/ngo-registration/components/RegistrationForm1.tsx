import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { nomenclature } from "@/src/constants/nomenclature";
import FormTitle from "./FormTitle";
import { NgoRegistrationFormData } from "../types";
import { UploadBox } from "@/src/components/UploadBox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { getData } from "country-list";
import { Field, FieldLabel } from "@/src/components/ui/field";
import { UploadDocumentType } from "@/src/constants/types";
import { validators } from "@/src/constants/validation";
import { toast } from "sonner";

interface RegistrationForm1Props {
  changeStep: (step: string) => void;
  ngoData: NgoRegistrationFormData;
  updateNgoData: Dispatch<SetStateAction<NgoRegistrationFormData>>;
}
const RegistrationForm1: React.FC<RegistrationForm1Props> = ({
  changeStep,
  ngoData,
  updateNgoData,
}) => {
  const countries = getData();
  const [error, setError] = useState({
    email: "",
    taxId: "",
    officialWebsite: "",
  });
  const validateForm = () => {
    if (
      error.email === "" &&
      error.taxId === "" &&
      error.officialWebsite === ""
      )
        changeStep("2");
      else
        toast.error("Please fill all the required fields.");
  };
  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <FormTitle
        title={nomenclature.ORGANIZATION_DETAILS}
        description={nomenclature.ORGANIZATION_DETAILS_DESCRIPTION}
      />
      <Input
        label="Organization Name"
        value={ngoData.organizationName}
        onChange={(e) =>
          updateNgoData((prev) => ({
            ...prev,
            organizationName: e.target.value,
          }))
        }
        placeholder="e.g. Global Health Initiative"
      />
      <Input
        label="Organization Email"
        error={error.email}
        value={ngoData.email}
        onChange={(e) =>
          updateNgoData((prev) => ({
            ...prev,
            email: e.target.value,
          }))
        }
        onBlur={(e) => {
          setError((prev) => ({
            ...prev,
            email: validators.email(e.target.value),
          }));
        }}
        required
        placeholder="e.g. global.health.initiative@example.com"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="12-3456789"
          error={error.taxId}
          required
          label="EIN / Tax ID"
          value={ngoData.taxId}
          onChange={(e) =>
            updateNgoData((prev) => ({ ...prev, taxId: e.target.value }))
          }
          onBlur={(e) => {
            setError((prev) => ({
              ...prev,
              taxId: validators.taxId(e.target.value),
            }));
          }}
        />
        <Select
          value={ngoData.country}
          onValueChange={(value) =>
            updateNgoData((prev) => ({ ...prev, country: value }))
          }
        >
          <Field className="space-y-0">
            <FieldLabel>
              Country<span className="text-destructive">*</span>
            </FieldLabel>
            <SelectTrigger className="gap-0">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
          </Field>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Input
        label="Official Website"
        placeholder="https://www.organization.org"
        value={ngoData.website}
        error={error.officialWebsite}
        required={false}
        onChange={(e) =>
          updateNgoData((prev) => ({ ...prev, website: e.target.value }))
        }
        onBlur={(e) => {
          setError((prev) => ({
            ...prev,
            officialWebsite: validators.url(e.target.value),
          }));
        }}
      />

      <UploadBox
        fieldName="Company profile picture"
        title="Upload Profile picture"
        subtitle="JPG or PNG or WEBP (Max 2MB)"
        onlyImage={true}
        value={ngoData.profileImage}
        onChange={(file) =>
          updateNgoData((prev) => ({
            ...prev,
            profileImage: file as UploadDocumentType,
          }))
        }
        setNGOData={updateNgoData}
      />

      <UploadBox
        fieldName="Supporting documents"
        title="Upload NGO Registration Certificate, Annual Reports & Financial Statements"
        subtitle="PDF, JPG or PNG (Max 10MB)"
        onlyImage={false}
        limit={5}
        value={ngoData?.documents}
        multifile={true}
        onChange={(file) =>
          updateNgoData((prev) => ({
            ...prev,
            documents: file as Array<UploadDocumentType>,
          }))
        }
      />

      <div className="flex justify-end items-center pt-4">
        <Button
          text="Continue to Mission"
          disabled={
            ngoData.organizationName === "" ||
            ngoData.email === "" ||
            ngoData.taxId === "" ||
            ngoData.country === "" ||
            ngoData.website === "" ||
            ngoData.profileImage.name === "" ||
            ngoData.documents.length === 0
          }
          onClick={() => {
            validateForm();
          }}
        />
      </div>
    </div>
  );
};

export default RegistrationForm1;

"use client";
import { Input } from "@/src/components/ui/input";
import { nomenclature } from "@/src/constants/nomenclature";
import { NotebookPen } from "lucide-react";
import SelectCause from "../../ngo-registration/components/SelectCause";
import { Campaign } from "../type";
import { FC } from "react";

type BasicInformationProps = {
  campaignData: Campaign;
  setCampaignData: React.Dispatch<React.SetStateAction<Campaign>>;
}
const BasicInformation:FC<BasicInformationProps> = ({ campaignData, setCampaignData }) => {
  return (
    <div className="bg-white rounded-lg py-8 px-5">
      <div className="flex items-center gap-2">
        <div className="aspect-square flex justify-center items-center bg-primary-light w-9 rounded-lg">
          <NotebookPen className="text-primary" size={17} />
        </div>
        <h2 className="font-bold text-xl text-secondaryText">
          {nomenclature.BASIC_INFORMATION}
        </h2>
      </div>
      <div className="mt-3 space-y-3">
        <Input
          label={"Cause Title"}
          required={false}
          onChange={(e)=>{
            setCampaignData((prev) => ({ ...prev, title: e.target.value }))
          }}
          placeholder="e.g. Clean Water Initiative for Sahel Region"
        />
        <p className="text-sm font-semibold text-primaryText uppercase">
          cause category
        </p>
        <SelectCause
          setCause={(cause) =>
            setCampaignData((prev) => ({ ...prev, cause: cause }))
          }
          cause={campaignData.cause}
        />
      </div>
    </div>
  );
};

export default BasicInformation;

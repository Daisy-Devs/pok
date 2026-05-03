import { UploadBox } from "@/src/components/UploadBox";
import { nomenclature } from "@/src/constants/nomenclature";
import { ImageIcon } from "lucide-react";
import React, { FC } from "react";
import { Campaign } from "../type";
import { UploadDocumentType } from "@/src/constants/types";

type CampaignVisualsProps = {
  campaignData: Campaign;
  setCampaignData: React.Dispatch<React.SetStateAction<Campaign>>;
}
const CampaignVisuals:FC<CampaignVisualsProps> = ({ campaignData, setCampaignData }) => {
  return (
    <div className="bg-white rounded-lg py-8 px-5 w-xs">
         <div className="flex items-center gap-2 mb-5">
        <div className="aspect-square flex justify-center items-center bg-primary-light w-9 rounded-lg">
          <ImageIcon className="text-primary" size={17} />
        </div>
        <h2 className="font-bold text-xl text-secondaryText">
          {nomenclature.CAMPAIGN_VISUALS}
        </h2>
      </div>
      <UploadBox 
      onlyImage
      multifile
      fieldName="Cause/Campaign images"
      title={"Upload Campaign Visuals"}
      subtitle={"PNG, JPG up to 10MB (16:9 recommended)"}
      onChange={(value)=>{
        setCampaignData((prev) => ({
          ...prev,
          imageUrl: value as Array<UploadDocumentType>,
        }))
      }}
      limit={5}
      />
    </div>
  );
};

export default CampaignVisuals;

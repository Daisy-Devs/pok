import RichTextEditor from "@/src/components/RichTextEditor";
import { nomenclature } from "@/src/constants/nomenclature";
import { TextAlignEnd } from "lucide-react";
import { Campaign } from "../type";
import { Dispatch, FC, SetStateAction } from "react";

type MissionStatementProps = {
  campaignData: Campaign;
  setCampaignData: Dispatch<SetStateAction<Campaign>>;
}
const MissionStatement:FC<MissionStatementProps> = ({ campaignData, setCampaignData }) => {
  return (
    <div className="bg-white rounded-lg py-8 px-5 w-lg">
      <div className="flex items-center gap-2 mb-5">
        <div className="aspect-square flex justify-center items-center bg-primary-light w-9 rounded-lg">
          <TextAlignEnd className="text-primary" size={17} />
        </div>
        <h2 className="font-bold text-xl text-secondaryText">
          {nomenclature.MISSION_STATEMENT}
        </h2>
      </div>
      <label className="text-xs font-semibold uppercase mb-3">
        {nomenclature.WHY}
      </label>
      <RichTextEditor
        value={campaignData.missionStatement}
        onChange={(value) =>
          setCampaignData((prev) => ({
            ...prev,
            missionStatement: value as string,
          }))
        }
      />
    </div>
  );
};

export default MissionStatement;

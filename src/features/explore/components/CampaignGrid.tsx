import CampaignCard from "./CampaignCard";
import { Campaign } from "../types";

export default function CampaignGrid({ data }: { data: Campaign[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {data.map((c) => (
        <CampaignCard key={c.id} campaign={c} />
      ))}
    </div>
  );
}
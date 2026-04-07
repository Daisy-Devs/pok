import { Campaign } from "../types";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";

const progressColor = "bg-primary";
const categoryStyle = "bg-white text-secondary-dark font-bold";

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Card
      variant="campaign"
      className="hover:shadow-md transition border "
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={campaign.image}
          className="w-full h-full object-cover hover:scale-105 transition"
        />

        {/* ✅ FIXED */}
        <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full ${categoryStyle}`}>
          {campaign.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="font-bold text-lg">{campaign.title}</h3>

        <p className="text-sm text-foreground line-clamp-2">
          {campaign.description}
        </p>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{campaign.progress}%</span>
          </div>

          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            {/* ✅ FIXED */}
            <div
              className={`${progressColor} h-full rounded-full`}
              style={{ width: `${campaign.progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="font-bold">
            {campaign.raised} {campaign.currency}
          </p>
          <Button text="Donate"/>
        </div>
      </div>
    </Card>
  );
}
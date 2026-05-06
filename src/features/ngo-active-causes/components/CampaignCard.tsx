import { Clock } from "lucide-react";
import { Campaign } from "./types";
import { Card } from "@/src/components/ui/card";
import Image from "next/image";
import { ProgressWithLabel } from "@/src/components/ui/progress";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const {
    title,
    description,
    image,
    raised,
    goal,
    progress,
    lastEdited,
    status,
  } = campaign;

  const displayRaised = campaign.raised || 0;
  const displayGoal = campaign.goal || 0;
  const displayProgress = campaign.progress || 0;

  return (
    <Card variant="campaign" className="hover:shadow-md transition border">
      {" "}
      {/* Image / Header */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image ? image : "/placeholder.jpg"}
          alt="Campaign"
          width={500}
          height={500}
          loading="eager"
          className="w-full h-full object-cover hover:scale-105 transition"
        />

        {/* Status Badge */}
        <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full ">
          {status.toUpperCase()}
        </span>
      </div>
      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-foreground line-clamp-2">{description}</p>

        {/* ACTIVE */}
        {status === "active" && (
          <>
            <div className="text-sm font-medium">{raised} ETH raised</div>

            <div>
              <ProgressWithLabel
                className="w-full h-3"
                value={displayProgress}
                label={
                  <span>
                    <span className="font-bold text-sm text-secondaryText">
                      Progress
                    </span>{" "}
                  </span>
                }
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={12} /> days left
              </span>
              <span>Goal: {goal} ETH</span>
            </div>
          </>
        )}

        {/* DRAFT */}
        {status === "draft" && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Last edited {lastEdited}</span>
            <button className="text-indigo-600 font-medium">
              Edit Draft →
            </button>
          </div>
        )}

        {/* COMPLETED */}
        {status === "completed" && (
          <div className="text-emerald-600 font-semibold text-sm">
            100% FUNDED ({goal} ETH)
          </div>
        )}
      </div>
    </Card>
  );
}

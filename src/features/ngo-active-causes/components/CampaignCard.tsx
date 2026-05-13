import { Campaign, CampaignStatus } from "./types";
import { Card } from "@/src/components/ui/card";
import Image from "next/image";
import { ProgressWithLabel } from "@/src/components/ui/progress";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const {
    title,
    description,
    image,
    raised,
    goal,
    token,
    progress,
    lastEdited,
    status,
  } = campaign;

  const displayRaised = campaign.raised || 0;
  const displayGoal = campaign.goal || 0;
  const displayProgress = campaign.progress || 0;
  const router = useRouter();
  const imageSource = image?.[0]?.url || "/svg/placeholder.svg";

  const statusStyles: Record<CampaignStatus, string> = {
    active: "bg-secondary text-black ",
    draft: "bg-white text-primary-color",
    completed: "bg-d-secondary-dark text-white",
  };

  console.log("Progress:", campaign.progress);
  return (
    <Card
      variant="cause"
      className="hover:shadow-md transition border max-w-sm w-full mx-auto"
    >
      {" "}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSource}
          alt="Campaign"
          width={600}
          height={700}
          className={`${!image?.[0] ? `w-30 h-30 ml-20 mt-10` : `w-full h-full`} object-cover hover:scale-105 transition`}
        />

        {/* Status Badge */}
        <span
          className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-bold ${statusStyles[status]}`}
        >
          {status.toUpperCase()}
        </span>
      </div>
      {/* Content */}
      <div className="p-3 flex flex-col gap-3">
        <h3 className="font-bold text-lg">{title}</h3>
        <p
          className="text-sm text-foreground line-clamp-2"
          dangerouslySetInnerHTML={{
            __html: description?.trim()
              ? description
              : status === "draft"
                ? "<p>This draft campaign does not have a mission statement yet.</p>"
                : "<p>No description available.</p>",
          }}
        />
        {/* ACTIVE */}
        {(status === "active" || status === "draft") && (
          <>
            {/* ONLY ACTIVE */}
            {status === "active" && (
              <div className="text-lg font-bold">{raised} {token} raised</div>
            )}
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

            <div className="flex justify-between text-md font-bold text-foreground">
              <span>Goal: {goal} {token}</span>
            </div>
          </>
        )}

        {/* DRAFT */}
        {status === "draft" && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Last edited {lastEdited}</span>
            <Button
              onClick={() => {
                router.push(
                  `/ngo/new-cause?editCampaign=${encodeURIComponent(JSON.stringify(campaign))}`,
                );
              }}
              variant={"ghost"}
              text="Edit Draft"
            />
          </div>
        )}

        {/* COMPLETED */}
        {status === "completed" && (
          <div className="text-secondary-dark font-semibold text-sm">
            100% FUNDED ({goal} {token})
          </div>
        )}
      </div>
    </Card>
  );
}

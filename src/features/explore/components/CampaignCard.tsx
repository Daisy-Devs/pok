import { Campaign } from "../types";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { ProgressWithLabel } from "@/src/components/ui/progress";
import { DEFAULT_IMAGE_URL } from "@/src/constants/misc";
import Image from "next/image";
import { useRouter } from "next/navigation";

const categoryStyle = "bg-white text-secondary-dark font-bold";

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const handleDonate = (id: string) => {
    router.push(`/campaign/${id}`);
  };
  const image= campaign.image[0];
  console.log("campsss",campaign);
  
  return (
    <Card variant="campaign" className="hover:shadow-md transition border ">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={
            typeof imageSource === "string" &&
            imageSource.includes("cloudinary")
              ? imageSource
              : DEFAULT_IMAGE_URL
          }
          alt={campaign.title || "Campaign image"}
          width={500}
          height={500}
          loading="eager"
          className="w-full h-full object-cover hover:scale-105 transition"
        />

        <span
          className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full ${categoryStyle}`}
        >
          {campaign.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="font-bold text-lg">{campaign.title}</h3>

        <p
          className="text-sm text-foreground line-clamp-2"
          dangerouslySetInnerHTML={
            campaign.description ? { __html: campaign.description } : undefined
          }
        />

        <div>
          <ProgressWithLabel
            className="w-full h-3"
            value={Math.floor(campaign.progress) || 0}
            label={
              <span>
                <span className="font-bold text-sm text-secondaryText">
                  Progress
                </span>{" "}
              </span>
            }
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="font-bold">
            {campaign.raised} {campaign.currency}/{campaign.goal}{" "}
            {campaign.currency}
          </p>
          <Button onClick={() => handleDonate(campaign.id)} text="Donate" />
        </div>
      </div>
    </Card>
  );
}

"use client";

import Pill from "@/src/components/Pill";
import { StatCard } from "@/src/components/StatCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { ProgressWithLabel } from "@/src/components/ui/progress";
import { splitTitle } from "@/src/lib/utils";
import { CheckCircle2, GlassWater, ShieldCheck, Users2, UserSquare } from "lucide-react";
import Image from "next/image";
import DonationCard from "./DonationCard";
import Autoplay from "embla-carousel-autoplay";
import Heading from "@/src/components/Heading";
import {
  useGetCampaignByIdQuery,
} from "@/src/store/services/api/campaignApi";
import { CAUSE_CATEGORIES, DEFAULT_IMAGE_URL } from "@/src/constants/misc";

interface CampaignInfoSectionProps {
  campaignId: string;
}

const CampaignInfoSection = ({ campaignId }: CampaignInfoSectionProps) => {
  const { data, isLoading, error } = useGetCampaignByIdQuery(campaignId);

  if (isLoading) return <p>Loading campaign...</p>;
  if (error) return <p>Failed to load campaign.</p>;
 
  const campaign = data?.data?.campaigns?.find((c: any) => c.id === campaignId);
  if (!campaign) return <p>Campaign not found.</p>;
  const title = splitTitle(campaign.title);
  const progress = campaign.goalAmount
    ? ((campaign.raisedAmount || 0) / campaign.goalAmount) * 100
    : 0;

  const isActive = campaign.status === "active";
  const nearGoal = progress >= 75;
  const Icon= CAUSE_CATEGORIES.find((category) => category.name === campaign.cause)!.icon;

  return (
    <div className="flex flex-col md:flex-row items-start gap-10 xl:gap-35 md:px-6">
      <div className="flex flex-col items-center md:items-start gap-6 xl:gap-16 xl:w-1/2">
        <div className="flex flex-col justify-center">
          <div className="flex gap-3">
            {isActive && <Pill text="Active Campaign" variant="primary" />}
            {nearGoal && (
              <Pill
                text="Goal Near"
                variant="secondary"
                icon={<CheckCircle2 className="w-4 h-4 color-secondary-dark" />}
              />
            )}
          </div>
          <Heading first={title.firstHalf} second={title.secondHalf} />
        </div>

        <Carousel
          className="w-80 md:w-159 xl:w-full"
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent className="-ml-2">
            {campaign.imageUrl.map((image: string, index: number) => (
              <CarouselItem key={index} className="pl-2 basis-full">
                <div className="relative w-full h-50 md:h-80 xl:h-100 overflow-hidden rounded-xl">
                  <Image
                    src={
                      image.includes("cloudinary") ? image : DEFAULT_IMAGE_URL
                    }
                    alt={"image" + index}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-5" />
          <CarouselNext className="right-5" />
        </Carousel>
        <p
          className="text-primaryText text-base font-normal w-80 md:w-159"
          dangerouslySetInnerHTML={{
            __html: campaign.missionStatement,
          }}
        />
        <div className="w-full">
          <p className="uppercase text-sm font-bold mb-1">funding progress</p>
          <ProgressWithLabel
            className="w-full h-3"
            value={progress}
            label={
              <span className="text-primaryText text-lg">
                <span className="font-extrabold text-2xl text-secondaryText">
                  {campaign.raisedAmount || 0} ETH
                </span>{" "}
                of {campaign.goalAmount} ETH raised
              </span>
            }
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 md:flex-row gap-6">
          <StatCard
            variant="sm"
            intent={"subtle"}
            label="Cause"
            value={campaign.cause}
            icon={
              <Icon className="w-5 h-5 color-primary" color="#4648D4" />
            }
          />
          <StatCard
            variant="sm"
            intent={"subtle"}
            label="Total Donors"
            value={campaign.totalDonors || 0}
            icon={
              <Users2 className="w-5 h-5 color-primary" color="#4648D4" />
            }
          />
          <StatCard
            variant="sm"
            intent={"subtle"}
            label="On-Chain Audit"
            value={`100%`}
            icon={
              <ShieldCheck className="w-5 h-5 color-primary" color="#4648D4" />
            }
          />
        </div>
      </div>
      <DonationCard campaignId={campaign.campaignIdBytes32} />
    </div>
  );
};

export default CampaignInfoSection;

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
import { CheckCircle2, ShieldCheck, Users2, Globe2, Mail } from "lucide-react";
import Image from "next/image";
import DonationCard from "./DonationCard";
import Autoplay from "embla-carousel-autoplay";
import Heading from "@/src/components/Heading";
import { CAUSE_CATEGORIES, DEFAULT_IMAGE_URL } from "@/src/constants/misc";
import OrganisationDetails from "./OrganisationDetails";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { CampaignApi } from "../../explore/types";

interface CampaignInfoSectionProps {
  data:{data:CampaignApi}
}

const CampaignInfoSection = ({ data }:CampaignInfoSectionProps) => {
  const campaign = data?.data
  const title = splitTitle(campaign?.title);
  const progress = campaign?.goalAmount
    ? Math.floor(((campaign?.totalRaised || 0) / campaign?.goalAmount) * 100)
    : 0;

  const isActive = campaign?.status === "active" && campaign?.isGoalReached;
  const nearGoal = progress >= 75 && progress !== 100;
  const Icon = CAUSE_CATEGORIES.find(
    (category) => category?.name === campaign?.cause,
  )?.icon;

  const organisationData = {
    name: campaign?.organization?.name || "Unknown Host",
    email: campaign?.organization?.email || "No email provided",
    website: campaign?.organization?.website || "",
    logo: campaign?.organization?.logo || "",
  };
  console.log("Mapped Organisation Props:", organisationData);

  console.log("campaign", campaign);

  return (
    <div className="flex flex-col md:flex-row items-start gap-10 xl:gap-35 md:px-6">
      <div className="flex flex-col items-center md:items-start gap-6 xl:gap-16 xl:w-1/2">
        <div className="flex flex-col justify-center">
          <div className="flex gap-3">
            {isActive  && <Pill text="Active Campaign" variant="primary" />}
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
            {campaign?.imageUrl?.map((image:{ public_id: string; url: string }, index: number) => {
              return (
                <CarouselItem key={index} className="pl-2 basis-full">
                  <div className="relative w-full h-50 md:h-80 xl:h-100 overflow-hidden rounded-xl">
                    <Image
                      src={
                        image?.url?.includes("cloudinary")
                          ? image?.url
                          : DEFAULT_IMAGE_URL
                      }
                      alt={"image" + index}
                      fill
                      sizes="320px"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="left-5" />
          <CarouselNext className="right-5" />
        </Carousel>
        <p
          className="text-primaryText text-base font-normal w-80 md:w-159"
          dangerouslySetInnerHTML={{
            __html: campaign?.missionStatement,
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
                  {Number(campaign?.totalRaised).toFixed(2) || 0} {campaign?.goalToken}
                </span>{" "}
                of {campaign?.goalAmount} {campaign?.goalToken} raised
              </span>
            }
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 md:flex-row gap-6">
          <StatCard
            variant="sm"
            intent={"subtle"}
            label="Cause"
            value={campaign?.cause}
            icon={Icon && <Icon className="w-5 h-5 color-primary" color="#4648D4" />}
          />
          <StatCard
            variant="sm"
            intent={"subtle"}
            label="Total Donors"
            value={campaign?.totalDonors || 0}
            icon={<Users2 className="w-5 h-5 color-primary" color="#4648D4" />}
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
      <div>
        {campaign?.isGoalReached?
        <div className="flex flex-col justify-center items-center space-y-3 p-7 rounded-3xl border-2 border-primary-light">
          <DotLottieReact
                      src="/gif/GoalAchieved.lottie"
                      loop
                      autoplay
                      style={{ width: 200, height: 200 }}
                    />
                    <p className="text-xl font-extrabold text-center text-primary mt-2">
                      Goal Achieved🎉. Kindness Reached Its Target!
                    </p>
                  </div>:
        <DonationCard
          campaignIdentifier={campaign?.campaignId}
          campaignId={campaign?.campaignIdBytes32}
          campaignToken={campaign?.goalToken}
        />}
        <OrganisationDetails organisation={organisationData} />
      </div>
    </div>
  );
};

export default CampaignInfoSection;

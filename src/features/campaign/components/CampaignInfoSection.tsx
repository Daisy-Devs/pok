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
import { CheckCircle2, GlassWater } from "lucide-react";
import Image from "next/image";
import React from "react";
import DonationCard from "./DonationCard";
import Autoplay from "embla-carousel-autoplay";

const CampaignInfoSection = () => {
  const title = splitTitle("Clean water for communities");

  const images = [
    "https://images.unsplash.com/photo-1536939459926-301728717817",
    "https://images.unsplash.com/photo-1738969596294-cf44e5091c18",
    "https://images.unsplash.com/photo-1559079236-2e64f89c7764",
  ];

  return (
    <div className="flex items-center gap-10 px-6">
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex gap-3">
            <Pill text="Active Campaign" variant="primary" />
            <Pill
              text="Goal Near"
              variant="secondary"
              icon={<CheckCircle2 className="w-4 h-4 color-secondary-dark" />}
            />
          </div>
          <h1 className="font-extrabold text-tertiary text-6xl leading-none mt-4">
            {title.firstHalf}
          </h1>
          <h1 className="font-extrabold text-primary text-6xl leading-none">
            {title.secondHalf}
          </h1>
        </div>

        <Carousel
          className="w-159"
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent className="-ml-2">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-2 basis-full">
                <div className="relative w-full h-80 overflow-hidden rounded-xl">
                  <Image
                    src={image}
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
        <p className="text-primaryText text-base font-normal w-159">
          {`Leverage decentralized transparency to provide sustainable filtration
  systems to remote villages. Every Satoshi is tracked from your wallet to the
  well.`}
        </p>
        <div>
          <p className="uppercase text-sm font-bold mb-1">funding progress</p>
          <ProgressWithLabel
            className="w-full h-3"
            value={60}
            label={
              <span className="text-primaryText text-lg">
                <span className="font-extrabold text-2xl text-secondaryText">
                  $18,500
                </span>{" "}
                of $20,000 raised
              </span>
            }
          />
        </div>
        <div className="flex gap-6">
          <StatCard
            variant="sm"
            intent={"subtle"}
            label="Water Purified"
            value={"450k L"}
            icon={
              <GlassWater className="w-5 h-5 color-primary" color="#4648D4" />
            }
          />
          <StatCard
            variant="sm"
            intent={"subtle"}
            label="Water Purified"
            value={"450k L"}
            icon={
              <GlassWater className="w-5 h-5 color-primary" color="#4648D4" />
            }
          />
          <StatCard
            variant="sm"
            intent={"subtle"}
            label="Water Purified"
            value={"450k L"}
            icon={
              <GlassWater className="w-5 h-5 color-primary" color="#4648D4" />
            }
          />
        </div>
      </div>
      <DonationCard />
    </div>
  );
};

export default CampaignInfoSection;

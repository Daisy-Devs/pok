import React from "react";
import Image from "next/image";
import { StatsCardProps } from "../types";
import { Button } from "@/src/components/ui/button";

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  image,
}) => {
  return (
    <div className="flex items-center justify-between bg-white-100 rounded-2xl p-10 w-full shadow-sm relative">
      {/* Left Content */}
      <div className="flex flex-col gap-2 text-foreground font-semibold">
        <p>{title}</p>

        <h2 className="text-2xl font-bold text-tertiary">{value}</h2>

        <div className="flex items-center gap-2 text-sm">
          <Button variant={"green"} size={"short"} text={change} />

          <span className="text-primary-color">{changeLabel}</span>
        </div>
      </div>

      {/* Image */}

      <div className="opacity-30 absolute top-4 right-4">
        <Image
          src={image}
          alt="stat icon"
          width={50}
          height={50}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default StatsCard;

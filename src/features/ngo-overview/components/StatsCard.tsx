import React from "react";
import Image from "next/image";
import { StatsCardProps } from "../types";
import { Button } from "@/src/components/ui/button";

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
}) => {
  return (
    <div className="flex items-center justify-between bg-white   rounded-xl px-5 py-2 w-full shadow-sm relative">
      {/* Left Content */}
      <div className="flex flex-col gap-2 text-foreground font-semibold">
        <p>{title}</p>

        <h2 className="text-2xl font-bold text-tertiary">{value}</h2>

        {change && changeLabel && (
          <div className="flex items-center gap-2 text-sm">
            {/* <Button variant={"green"} size={"short"} text={change} /> */}
          </div>
        )}
      </div>

      {/* Image */}

      <div className="opacity-30 absolute top-4 right-4">
        <Icon className="w-12 h-12 text-primary" />
      </div>
    </div>
  );
};

export default StatsCard;

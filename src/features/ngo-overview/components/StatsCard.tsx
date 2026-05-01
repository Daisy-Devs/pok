import React from "react";
import Image from "next/image";
import { StatsCardProps } from "../types";




const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  image,
}) => {
  return (
    <div className="flex items-center justify-between bg-gray-100 rounded-2xl p-6 w-full shadow-sm">
      
      {/* Left Content */}
      <div className="flex flex-col gap-2">
        <p>{title}</p>

        <h2 className="text-2xl font-bold text-gray-900">
          {value}
        </h2>

        <div className="flex items-center gap-2 text-sm">
          <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-md font-medium">
            {change}
          </span>
          <span className="text-gray-500">{changeLabel}</span>
        </div>
      </div>

      {/* Image */}
      <div className="opacity-80">
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
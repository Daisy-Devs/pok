import { CAUSE_CATEGORIES } from "@/src/constants/misc";
import { HeartHandshakeIcon, LucideProps } from "lucide-react";
import React, { FC } from "react";

interface CauseProps {
  cause: string;
  organization?: string;
  individual?: boolean;
}

const Cause: React.FC<CauseProps> = ({
  cause,
  organization,
  individual = false,
}) => {
  const Icon =
    CAUSE_CATEGORIES.find((category) => category.name === cause)?.icon ||
    ((<HeartHandshakeIcon />) as unknown as FC<LucideProps>);
  return (
    <div className="flex flex-row gap-3">
      <div className="flex justify-center items-center rounded-xl aspect-square h-10 bg-primary-light">
        <Icon className="text-primary" size={20} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-secondarText">
          {individual ? organization : cause}
        </p>

        {organization && (
          <p className="text-xs">{individual ? cause : organization}</p>
        )}
      </div>
    </div>
  );
};

export default Cause;

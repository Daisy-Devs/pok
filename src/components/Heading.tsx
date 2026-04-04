import React from "react";

interface HeadingProps {
  first: string;
  second: string;
  size?: "sm" | "lg";
}
const Heading: React.FC<HeadingProps> = ({ first, second, size = "sm" }) => {
  return (
    <div className={`w-xl pr-3`}>
      <h1
        className={`font-extrabold ${size === "sm" ? "text-6xl" : "text-7xl"} leading-none mt-4`}
      >
        <span className="text-tertiary">{first}{" "}</span>
        <span
          className={`text-primary`}
        >
          {second}
        </span>
      </h1>
    </div>
  );
};

export default Heading;

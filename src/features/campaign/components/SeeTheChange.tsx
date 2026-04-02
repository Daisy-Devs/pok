import { Button } from "@/src/components/ui/button";
import React from "react";

const SeeTheChange = () => {
  return (
    <div
      className="rounded-lg bg-cover bg-center w-full h-100 pl-8"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1170')",
      }}
    >
      <div className="bg-black/30 w-125 mt-20 p-5 rounded-lg flex flex-col justify-center gap-5">
        <div>
          <h2 className="text-4xl font-bold text-white">
            See the change you fuel.
          </h2>
          <p className="text-base font-semibold text-white mt-4 w-lg">
            Join 4,000+ donors who have abandoned traditional charity for
            high-frequency on-chain philanthropy.
          </p>
        </div>
        <Button variant={"white"} textClassName="font-bold text-secondaryText" text="Explore similar campaigns" />
      </div>
    </div>
  );
};

export default SeeTheChange;

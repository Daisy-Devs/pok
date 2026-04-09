"use client";
import React from "react";
import ImpactWidget from "./ImpactWidget";
import { Button } from "@/src/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { nomenclature } from "@/src/constants/nomenclature";

export default function HeroSection() {
  return (
    <div>
      <section
        className="pt-16 pb-16 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg,#f0f0ff 0%,#f8f8ff 40%,#e8f4f8 100%)",
        }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle,#d1d5db 1px,transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-16">
            {/* Left copy */}
            <div className="flex-1 max-w-xl">
              {/* SOC2 badge */}
              <div className="fade-in-1  mb-8 ">
                
                <Button
                  className="font-bold"
                  text={nomenclature.HOME_BADGE}
                  variant={"purple"}
                  size={'default'}
                  leftIcon={<ShieldCheck size={18} />}
                />
              </div>

              <h1 className="fade-in-2 text-6xl font-bold text-tertiary leading-[1.1] tracking-tight mb-6">
                Anonymity-
                <br />
                Powered
                <span className="text-primary"> Crypto Donations</span> for
                <br />
                Global Good
              </h1>

              <p className="fade-in-3 text-foreground text-[15px] leading-relaxed mb-10 max-w-md">
                {nomenclature.HOME_PARA}
              </p>

              <div className="fade-in-4 flex items-center gap-3">
                <Button text={nomenclature.DONATE} variant={"blue"} />

                <Button text={nomenclature.REGISTER} variant={'white'} />
              </div>
            </div>

            {/* Right: Impact Widget */}
            <div className="fade-in-3 lg:shrink-0 w-full lg:w-85 mt-6 lg:mt-18">
              {" "}
              <ImpactWidget />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

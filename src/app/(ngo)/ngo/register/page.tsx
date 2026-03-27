"use client";
import { nomenclature } from "@/src/constants/nomenclature";
import RegistrationForm1 from "@/src/features/ngo-registration/components/RegistrationForm1";
import RegistrationForm2 from "@/src/features/ngo-registration/components/RegistrationForm2";
import RegistrationForm3 from "@/src/features/ngo-registration/components/RegistrationForm3";
import { Step } from "@/src/features/ngo-registration/components/Step";
import { ShieldCheck } from "lucide-react";
import React, { useState } from "react";

const NGORegistration = () => {
  const [activeStep, setActiveStep] = useState("1");
  return (
    <div className="flex gap-6 py-6 px-30">
      <div className="w-1/4 space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-tertiary">
            {nomenclature.NGO_REGISTRATION}
          </h1>
          <p className="text-sm text-primaryText mt-2">
            {nomenclature.NGO_REGISTRATION_DESCRIPTION}
          </p>
        </div>

        <div className="space-y-0.5">
          <Step
            step="1"
            active={activeStep == "1"}
            title="Organization Details"
            subtitle="Legal entity information"
          />
          <Step
            step="2"
            active={activeStep == "2"}
            title="Mission & Causes"
            subtitle="Define your impact"
          />
          <Step
            step="3"
            active={activeStep == "3"}
            title="Wallet Setup"
            subtitle="Security & verification"
          />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm text-sm">
          <div className="flex gap-2 mb-2">
            <ShieldCheck size={18} className="text-secondary-dark" />
            <p className="text-secondary-dark text-xs font-bold">
              {nomenclature.SECURE_VERIFICATION}
            </p>
          </div>
          <p className="text-primaryText text-xs text-left">
            {nomenclature.SECURE_VERIFICATION_DESCRIPTION}
          </p>
        </div>
      </div>
     {activeStep=='1' && <RegistrationForm1 changeStep={setActiveStep}  />}
     {activeStep=='2' && <RegistrationForm2 changeStep={setActiveStep}/>}
     {activeStep=='3' && <RegistrationForm3  changeStep={setActiveStep}/>}
    </div>
  );
};

export default NGORegistration;

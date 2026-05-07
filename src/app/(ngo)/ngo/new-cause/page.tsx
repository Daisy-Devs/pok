"use client";
import { Button } from "@/src/components/ui/button";
import { Spinner } from "@/src/components/ui/spinner";
import BasicInformation from "@/src/features/new-cause/components/BasicInformation";
import CampaignVisuals from "@/src/features/new-cause/components/CampaignVisuals";
import Financials from "@/src/features/new-cause/components/Financials";
import MissionStatement from "@/src/features/new-cause/components/MissionStatement";
import { Campaign } from "@/src/features/new-cause/type";
import { useCreateCampaignMutation } from "@/src/store/services/api/campaignApi";
import { SendHorizonalIcon, Users2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CreateNewCause = () => {
  const [campaignData, setCampaignData] = useState<Campaign>({
    title: "",
    cause: "",
    missionStatement: "",
    imageUrl: [],
    goalAmount: 0,
    goalToken: "ETH",
  });
  const [createCampaign,{isLoading}]=useCreateCampaignMutation();
  const router=useRouter();
  const createAndPublishCampaign=async()=>{    
    try{
    const res=await createCampaign({
      ...campaignData,
      status:"active"
    }).unwrap();
    console.log(res);
    console.log("created new cause",{
      ...campaignData,
      status:"active"
    });
    setCampaignData({
      title: "",
      cause: "",
      missionStatement: "",
      imageUrl: [],
      goalAmount: 0,
      goalToken: "ETH",
    })
    toast.success("Campaign created successfully");
    router.push('/ngo')
  }
  catch(err){
    console.log(err);
    toast.error("Campaign creation failed");
  }

  }
  return (
    <div>
      <div className="flex gap-2 p-2">
        <div className="flex flex-col gap-6">
          {/** Basic info */}
          <BasicInformation
            campaignData={campaignData}
            setCampaignData={setCampaignData}
          />
          {/** Mission Statement */}
          <MissionStatement
            campaignData={campaignData}
            setCampaignData={setCampaignData}
          />
        </div>
        <div className="flex flex-col gap-7">
          {/** Campaign Visuals */}
          <CampaignVisuals
            campaignData={campaignData}
            setCampaignData={setCampaignData}
          />
          {/** Financials */}
          <Financials
            campaignData={campaignData}
            setCampaignData={setCampaignData}
          />
        </div>
      </div>

      {/** CTAs */}
      <div className="flex gap-5 mt-7 justify-end p-4 border-t-2 border-border">
      <Button text="Save Draft" variant="ghost" />
      <Button onClick={()=>{createAndPublishCampaign()}} disabled={isLoading||!campaignData.cause||!campaignData.missionStatement||!campaignData.title||campaignData?.imageUrl?.length===0||!campaignData?.goalAmount||!campaignData?.goalToken} text="Publish Cause" rightIcon={isLoading?<Spinner/>:<SendHorizonalIcon className="text-white h-4"/>}/>
      </div>
            {/** Banner */}
      <div className="flex justify-between px-4 bg-gradient-to-tr from-[#131B2E] via-[#162036] to-[#324572] rounded-2xl">
        <div className="p-7">
          <h2 className="text-2xl font-bold text-white w-xs">
            Your cause will be showcased to over 50,000 verified crypto donors.
          </h2>
          <p className="text-primary-light mt-3 w-md">
            Digital Custodian ensures that every dollar is tracked. Your donors
            can see the real-time impact of their contributions.
          </p>
          <p className="text-accent mt-5 text-xs"><Users2 className="inline w-5" /> Join 200+ NGOs at Proof Of Kindness</p>
        </div>
        <Image
          src="https://res.cloudinary.com/dlewjmqeb/image/upload/v1777821235/ngo-documents/sz8msko1oa7yodrrbrne.png"
          className="w-82 h-auto"
          width={600}
          height={200}
          alt="banner"
        />
      </div>
    </div>
  );
};

export default CreateNewCause;

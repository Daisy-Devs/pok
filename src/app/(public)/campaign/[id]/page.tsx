"use client";
import CampaignInfoSection from "@/src/features/campaign/components/CampaignInfoSection";
import LiveDonationActivity from "@/src/features/campaign/components/LiveDonationActivity";
import ProtocolTransparency from "@/src/features/campaign/components/ProtocolTransparency";
import SeeTheChange from "@/src/features/campaign/components/SeeTheChange";
import { useGetCampaignQuery } from "@/src/store/services/api/campaignApi";
import { useParams } from "next/navigation";

const Campaign =  () => {
  const {id} = useParams<{ id: string }>();
  console.log("Fetching campaign id: ",id);
  const {data, error}= useGetCampaignQuery(id);
  if(error) return <div>Something went wrong</div>;
  console.log("Campaign id",error, data);
  return (
    <div className="flex flex-col space-y-20 py-15 px-4">
      <CampaignInfoSection data={data} />
      <ProtocolTransparency />
      <LiveDonationActivity campaignId={id} />
      <SeeTheChange data={data} />
    </div>
  );
};

export default Campaign;

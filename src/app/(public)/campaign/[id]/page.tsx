import CampaignInfoSection from "@/src/features/campaign/components/CampaignInfoSection";
import LiveDonationActivity from "@/src/features/campaign/components/LiveDonationActivity";
import ProtocolTransparency from "@/src/features/campaign/components/ProtocolTransparency";
import SeeTheChange from "@/src/features/campaign/components/SeeTheChange";

interface CampaignProps {
  params: { id: string };
}
const Campaign = async ({ params }: CampaignProps) => {
  const resolvedParams = await params;

  const { id } = resolvedParams;

  let campaignCause = "All";

  try {
  } catch (error) {
    console.error("Failed to fetch cause on server:", error);
  }
  return (
    <div className="flex flex-col space-y-20 py-15">
      <CampaignInfoSection campaignId={id} />
      <ProtocolTransparency />
      <LiveDonationActivity campaignId={id} />
      <SeeTheChange campaignId={id} />
    </div>
  );
};

export default Campaign;

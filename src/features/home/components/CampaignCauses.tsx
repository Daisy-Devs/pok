
import { ArrowRight } from "lucide-react";
import { useGetAllCampaignsQuery } from "@/src/store/services/api/campaignApi";
import { Campaign, CampaignApi } from "../../explore/types";
import CampaignCard from "../../explore/components/CampaignCard";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { formatCryptoAmount } from "@/src/lib/utils";

type Tag = {
  label: string;
  variant: "indigo" | "green";
};

export default function CampaignCauses() {
  const { data, isLoading, isError } = useGetAllCampaignsQuery({});
  const campaigns: Campaign[] =
    data?.data?.campaigns?.map((c: CampaignApi) => ({
      id: c.id,
      title: c.title,
      description: c.missionStatement,
      category: c.cause,
      image: c.imageUrl,
      progress: Math.ceil((c.totalRaised / c.goalAmount) * 100),
      raised: c.totalRaised
        ? formatCryptoAmount(Number(c.totalRaised), c.goalToken)
        : 0,
      goal: c.goalAmount,
      currency: c.goalToken,
    })) || [];

  const topCampaigns = campaigns
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  return (
    <div>
      <section id="causes" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-start justify-between mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Urgent Causes Ready for Your Impact
              </h2>
              <p className="text-gray-500 text-[15px] max-w-md">
                Direct support where it&apos;s needed most. Your contribution
                bypasses red tape and goes straight to the front lines.
              </p>
            </div>
            <a
              href="/explore"
              className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 whitespace-nowrap mt-1 transition-colors shrink-0"
            >
              Explore All Causes
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading campaigns...</p>
            ) : topCampaigns.length === 0 ? (
              <div className="col-span-full flex justify-center">
                <DotLottieReact
                  src="/gif/Empty.lottie"
                  loop
                  autoplay
                  style={{ width: 200, height: 200 }}
                />
              </div>
            ) : (
              topCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

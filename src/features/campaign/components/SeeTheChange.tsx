'use client';
import { Button } from "@/src/components/ui/button";
import { nomenclature } from "@/src/constants/nomenclature";
import { useRouter } from "next/navigation";
import { CampaignApi } from "../../explore/types";

interface SeeTheChangeProps {
  data:{data:CampaignApi}
}
const SeeTheChange = ({data}:SeeTheChangeProps) => {
  
  const campaign = data?.data
  const cause = campaign?.cause || "All";
  const router = useRouter();

  const handleExplore = () => {
    router.push(`/explore?cause=${encodeURIComponent(cause)}`);
  };
  return (
    <div
      className="rounded-lg bg-cover bg-center w-full h-65 md:h-100 pl-8"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1170')",
      }}
    >
      <div className="bg-black/30 w-62 md:w-125 mt-5 md:mt-20 p-2 md:p-5 rounded-lg flex flex-col justify-center gap-1 md:gap-5">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            See the change you fuel.
          </h2>
          <p className="text-xs md:text-base font-semibold text-white mt-4 w-39 md:w-lg">
            {nomenclature.JOIN_THE_MOVEMENT}
          </p>
        </div>
        <Button
          variant="white"
          text="Explore similar campaigns"
          onClick={handleExplore}
        />
      </div>
    </div>
  );
};

export default SeeTheChange;

// Backend response type
export interface CampaignApi {
  id: string;
  title: string;
  missionStatement: string;
  cause: string;
  imageUrl: Array<{ public_id: string; url: string }>;
  goalAmount: number;
  totalRaised: number;
  goalToken: "ETH" | "USDC" | "USDT" | "DAI";
  status: "active" | "completed" | "draft";
  isGoalReached?: boolean;
  organization: {
    name: string;
    email: string;
    website: string;
    logo: string;
    walletAddress?: `0x${string}`;
    profileImage?: {
      public_id?: string;
      url?: string;
    };
  };
  totalDonors: number;
  campaignIdBytes32: string;
  campaignId: string;
}

// UI type (used by CampaignCard)
export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  image: Array<{ public_id: string; url: string }>;
  progress: number;
  raised: number;
  currency: string;
  goal: number;
  status: "active" | "completed" | "draft";
}

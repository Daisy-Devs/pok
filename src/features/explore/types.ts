// Backend response type
export interface CampaignApi {
  id: string;
  title: string;
  missionStatement: string;
  cause: string;
  imageUrl: string[];
  goalAmount: number;
  raisedAmount?: number;
}

// UI type (used by CampaignCard)
export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string[];
  progress: number;
  raised: number;
  currency: string;
}
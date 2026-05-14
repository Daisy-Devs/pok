export type CampaignStatus = "active" | "draft" | "completed";

export type TabStatus = CampaignStatus | "all";

export type Campaign = {
  id: string;
  title: string;
  description: string;
  category?: string;
  image?: any[];
  raised?: number;
  goal?: number;
  token?: 'ETH' | 'DAI' | 'USDC' | 'USDT';
  progress?: number;
  lastEdited?: string;
  status: CampaignStatus;
};
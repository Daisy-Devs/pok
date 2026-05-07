export type CampaignStatus = "active" | "draft" | "completed";

export type TabStatus = CampaignStatus | "all";

export type Campaign = {
  id: string;
  title: string;
  description: string;
  image?: string;
  raised?: number;
  goal?: number;
  progress?: number;
  lastEdited?: string;
  status: CampaignStatus;
};
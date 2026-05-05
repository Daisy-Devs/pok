export type CampaignStatus = "active" | "draft" | "completed" | "all";

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

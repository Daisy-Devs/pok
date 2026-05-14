export type DonationActivity = {
  campaignId: string;
  cause: string;
  organization: string;
  amount: number;
  date: string;
  etherScanLink: string;
};

export type UserType = {
  name: string;
  isAnonymous: boolean;
};

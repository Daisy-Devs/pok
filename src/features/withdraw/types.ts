export type CampaignBalance={
    campaignTitle: string;
    remainingBalance: string;
    token: string;
    cause: string;
    campaignIdBytes32: string;
}

export type ClaimHistoryApi = {
    amount: string;
    campaignTitle: string;
    createdAt: string;
    transactionHash: string;
    campaignToken: string;
};
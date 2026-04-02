export type DonationActivity={
    id: string;
    donorName: string|'Anonymous';
    amount: number;
    timestamp: string;
    etherScanLink?: string;
}

export type UserType={
    name: string;
    isAnonymous: boolean;
}
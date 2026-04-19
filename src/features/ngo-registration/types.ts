  export interface NgoRegistrationFormData {
    organizationName: string;
    taxId: string;
    email: string;
    country: string;
    website: string;
    profileImageUrl: string;
    walletAddress: string;
    documents: Array<{ name: string; url: string }>;
    title: string;
    missionStatement: string;
    cause: string;
    imageUrl: string;
    goalAmount: number;
  }
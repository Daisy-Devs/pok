import { UploadDocumentType } from "@/src/constants/types";

  export interface NgoRegistrationFormData {
    organizationName: string;
    taxId: string;
    email: string;
    country: string;
    website: string;
    profileImage: UploadDocumentType;
    public_id?: string;
    documents: Array<UploadDocumentType>;
    title: string;
    missionStatement: string;
    cause: string;
    imageUrl: Array<UploadDocumentType>;
    goalAmount: number;
    goalToken: "ETH" | "USDC" | "USDT" | "DAI"|"";
  }
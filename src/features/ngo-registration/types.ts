import { UploadDocumentType } from "@/src/constants/types";

  export interface NgoRegistrationFormData {
    organizationName: string;
    taxId: string;
    email: string;
    country: string;
    website: string;
    profileImageUrl: UploadDocumentType;
    documents: Array<UploadDocumentType>;
    title: string;
    missionStatement: string;
    cause: string;
    imageUrl: Array<UploadDocumentType>;
    goalAmount: number;
  }
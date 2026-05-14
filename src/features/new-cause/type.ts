import { UploadDocumentType } from "@/src/constants/types";

export type Campaign = {
    title: string
    cause: string
    missionStatement: string
    imageUrl: Array<UploadDocumentType>
    goalAmount: number
    goalToken: "ETH" | "USDC" | "USDT" | "DAI"
};
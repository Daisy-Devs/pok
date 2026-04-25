import { LucideProps } from "lucide-react";
import { FC } from "react";

export type UploadDocumentType = {
  name: string,
  url: string,
  type: string,
  public_id: string
};

export type CauseCategoryType = {
  name: string,
  icon: FC<LucideProps>;
}
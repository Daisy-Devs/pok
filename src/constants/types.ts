import { LucideProps } from "lucide-react";
import React, { FC, JSX } from "react";

export type UploadDocumentType = {
  name: string,
  url: string
};

export type CauseCategoryType = {
  name: string,
  icon: FC<LucideProps>;
}
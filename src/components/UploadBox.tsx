"use client";
import { Button } from "@/src/components/ui/button";
import { ImageUp, Upload } from "lucide-react";
import React, { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import UploadedFileList from "./UploadedFileList";
import {
  useUploadCampaignImagesMutation,
  useUploadCompanyProfileImageMutation,
  useUploadSupportingNgoDocumentsMutation,
} from "../store/services/api/documentApi";
import { UploadDocumentType } from "../constants/types";

interface UploadBoxProps {
  fieldName: string;
  title: string;
  value?: Array<UploadDocumentType> | UploadDocumentType;
  subtitle: string;
  onlyImage: boolean;
  multifile?: boolean;
  limit?: number;
  onChange: (value: Array<UploadDocumentType> | UploadDocumentType) => void;
}
export const UploadBox: React.FC<UploadBoxProps> = ({
  fieldName,
  title,
  value,
  subtitle,
  onlyImage,
  limit,
  multifile = false,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [
    uploadCompanyProfileImage,
    { isLoading: uploadingCompanyProfileImage },
  ] = useUploadCompanyProfileImageMutation();
  const [
    uploadSupportingNgoDocuments,
    { isLoading: uploadingSupportingNgoDocuments },
  ] = useUploadSupportingNgoDocumentsMutation();
  const [uploadCampaignImages] = useUploadCampaignImagesMutation();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const formData = new FormData();

    if (files.length > limit!) {
      toast.error(`You can only upload up to ${limit} files.`);
      return;
    }
    if (!files.every((file) => file.type.startsWith("image/")) && onlyImage) {
      toast.error(
        "Invalid file type. Please upload a JPG, PNG, or WEBP image.",
      );
      return;
    }
    if (
      files.some(
        (file) =>
          file.size >= 2 * 1024 * 1024 && file.type.startsWith("image/"),
      )
    ) {
      toast.error("One or more image files exceed the limit of 2MB.");
      return;
    }
    if (
      files.some(
        (file) =>
          file.size >= 10 * 1024 * 1024 && !file.type.startsWith("image/"),
      )
    ) {
      toast.error("One or more files exceed the limit of 10MB.");
      return;
    }

    if (fieldName === "Company profile picture") {
      formData.append("profileImage", files[0]);
      uploadCompanyProfileImage(formData)
        .unwrap()
        .then((res) => {
          console.log("Upload company profile image:", res);
          onChange({ name: files[0].name, url: res.profileImageUrl });
          if (uploadingCompanyProfileImage) {
            console.log("Uploading Profile");
          }
        })
        .catch((err) => {
          console.log("Failed to upload profile image. Error:", err);
          toast.error("Failed to upload profile image. Please try again.");
        });
    } else if (fieldName === "Cause/Campaign images") {
      const existingFiles = Array.isArray(value) ? value : value ? [value] : [];
      files.forEach((file, index) => {
        formData.append(`images`, file);
      });
      uploadCampaignImages(formData)
        .unwrap()
        .then((res) => {
          console.log("Upload campaign images:", res);
          const uploadedFiles = res.images.map((file: UploadDocumentType) => ({
              name: file.name,
              url: file.url,
            }))
          onChange([...existingFiles, ...uploadedFiles]);
        })
        .catch((err) => {
          console.log("Failed to upload campaign images. Error:", err);
          toast.error("Failed to upload campaign images. Please try again.");
        });
    } else if (fieldName === "Supporting documents") {
      const existingFiles = Array.isArray(value) ? value : value ? [value] : [];

      files.forEach((file) => {
        formData.append(`documents`, file);
      });
      uploadSupportingNgoDocuments(formData)
        .unwrap()
        .then((res) => {
          console.log("Upload supporting documents:", res);
          const uploadedFiles = res.documents.map(
            (file: UploadDocumentType) => ({
              name: file.name,
              url: file.url,
            }),
          ) as UploadDocumentType[];
          onChange([...existingFiles, ...uploadedFiles]);
        })
        .catch((err) => {
          console.log("Failed to upload supporting documents. Error:", err);
          toast.error(
            "Failed to upload supporting documents. Please try again.",
          );
        });
    }
  };
  const fileList = Array.isArray(value)
    ? value
    :value?.name ? [value] : [];

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-primaryText uppercase">
          {fieldName} <span className="text-destructive">*</span>
        </p>

        <div className="border-3 bg-background-secondary border-dashed rounded-xl p-6 text-center flex flex-col items-center space-y-3">
          {!onlyImage ? (
            <Upload size={45} color="#C6C6CD" className="self-center" />
          ) : (
            <ImageUp size={45} color="#C6C6CD" />
          )}
          <p className="text-sm font-semibold text-secondaryText">{title}</p>
          <p className="text-sm text-primaryText">{subtitle}</p>
          <input
            type="file"
            accept={
              onlyImage
                ? "image/png, image/jpeg, image/webp"
                : "application/pdf, image/png, image/jpeg"
            }
            ref={inputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              handleFileChange(e);
            }}
            multiple={multifile}
          />
          <Button
            variant={"white"}
            disabled={
              (fileList.length > 0 && !multifile) ||
              fileList.length >= (limit ?? Infinity)
            }
            onClick={() => inputRef.current?.click()}
            text="Select File"
            className="mt-3 text-xs font-semibold"
          />
        </div>
      </div>
      {fileList.length > 0 && <UploadedFileList files={fileList} />}
    </div>
  );
};

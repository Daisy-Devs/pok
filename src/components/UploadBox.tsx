"use client";
import { Button } from "@/src/components/ui/button";
import { ImageUp, Upload } from "lucide-react";
import React, { ChangeEvent, useRef } from "react";
import { toast } from "sonner";
import UploadedFileList from "./UploadedFileList";

interface UploadBoxProps {
  fieldName: string;
  title: string;
  value?: string | Array<{ name: string; url: string }>;
  subtitle: string;
  onlyImage: boolean;
  multifile?: boolean;
  onChange: (value: string |{ name: string; url: string }[]) => void;
}
export const UploadBox: React.FC<UploadBoxProps> = ({
  fieldName,
  title,
  value,
  subtitle,
  onlyImage,
  multifile=false,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files=Array.from(e.target.files || []);
    if (!files.every((file) => file.type.startsWith("image/")) && onlyImage) {
      toast.error("Invalid file type. Please upload a JPG, PNG, or WEBP image.");
      return;
    }
      const fileNames = files.map((file) => file.name);
      if(multifile){
          const merged = [...(Array.isArray(value) ? value : []), ...files];
    const unique = merged.filter((file, index, self) =>
      index === self.findIndex((f) => f.name === file.name)
    );
    onChange(unique.map((file) => ({ name: file.name,url:file.name+".com"})));
      } else {
        onChange(fileNames[0]);
      }
      console.log(fileNames);
  };
  const fileList = Array.isArray(value)
    ? value
    : value !== undefined && value !== ''
    ? [value]
    : [];

  return (
    <div className="space-y-2">
    <div className="space-y-2">
      <p className="text-sm font-semibold text-primaryText uppercase">{fieldName}</p>

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
          disabled={fileList.length >0 && !multifile}
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

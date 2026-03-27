"use client"
import { Button } from "@/src/components/ui/button";
import { ImageUp, Upload } from "lucide-react";
import React from "react";

interface UploadBoxProps {
    fieldName: string;
    title: string;
    subtitle: string;
    onlyImage:boolean
}
export const UploadBox:React.FC<UploadBoxProps>=({ fieldName, title, subtitle, onlyImage })=> {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-primaryText">{fieldName}</p>

      <div className="border-3 bg-background-secondary border-dashed rounded-xl p-6 text-center flex flex-col items-center space-y-3">
        {!onlyImage ?<Upload size={45} color='#C6C6CD' className="self-center" />:<ImageUp size={45} color='#C6C6CD' />}
        <p className="text-sm font-semibold text-secondaryText">{title}</p>
        <p className="text-sm text-primaryText">{subtitle}</p>
        <Button variant={"white"} text="Select File" className="mt-3 text-xs font-semibold"/>
      </div>
    </div>
  );
}

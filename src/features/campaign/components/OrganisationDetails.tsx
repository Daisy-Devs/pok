import { DEFAULT_IMAGE_URL } from "@/src/constants/misc";
import { Check, Globe2, Mail } from "lucide-react";
import Image from "next/image";
import React from "react";

interface OrganisationDetailsProps {
  organisation: {
    name: string;
    email: string;
    website?: string;
    logo?: string;
  };
}

export default function OrganisationDetails({
  organisation,
}: OrganisationDetailsProps) {
  const image = organisation.logo;
  return (
    <div>
      <div className="mt-auto pt-6">
        <div className="bg-gray-100 rounded-xl p-4">
          <h1 className="text-sm font-semibold text-primary-color uppercase mb-4">
            Campaign Host
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative w-15 h-15 shrink-0">
              <Image
                src={
                  image && image.includes("cloudinary")
                    ? image
                    : DEFAULT_IMAGE_URL
                }
                alt={organisation.name}
                fill
                className="rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </span>{" "}
            </div>
            <div>
              <h2 className="font-bold text-tertiary">{organisation.name}</h2>
              <div className="flex items-center gap-2 text-sm text-primary-color mt-1">
                <Mail className="w-4 h-4" />
                <span>{organisation.email}</span>
              </div>
              {organisation.website && (
                <a
                  href={
                    organisation.website.startsWith("http")
                      ? organisation.website
                      : `https://${organisation.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-color mt-1 cursor-pointer hover:text-gray-700"
                >
                  <Globe2 className="w-4 h-4" />
                  <span>Visit Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react'
import CauseCard from './CauseCard';
import { ArrowRight } from 'lucide-react';

type Tag = {
  label: string;
  variant: "indigo" | "green";
};

type Cause = {
  title: string;
  description: string;
  raised: string;
  percentage: number;
  image?: string; // ✅ add this
  tags: Tag[];
};

const CAUSES: Cause[] = [
  {
    title: "Emergency Aid: Gaza Health Clinics",
    description:
      "Providing critical medical supplies and fuel to keep community health clinics operational.",
    raised: "$84,200",
    image: "/causes/GlobalEducation.jpg",
    percentage: 84,
    tags: [
      { label: "Crisis Relief", variant: "indigo" },
      { label: "7 Days Left", variant: "green" },
    ],
  },
  {
    title: "Amazon Basin Reforestation",
    description:
      "Supporting indigenous-led efforts to replant native species in critical biological corridors..",
    raised: "$12,500",
    image: "/causes/Reforestation.jpg",
    percentage: 45,
    tags: [
      { label: "Disaster", variant: "indigo" },
      { label: "3 Days Left", variant: "green" },
    ],
  },
  {
    title: "Clean Water Systems in Turkana",
    description:
      "Deploying solar-powered water purification units to remote villages facing severe drought..",
    raised: "$12,500",
    image: "/causes/CleanWater.jpg",
    percentage: 45,
    tags: [
      { label: "Disaster", variant: "indigo" },
      { label: "3 Days Left", variant: "green" },
    ],
  },
];

export default function CampaignCauses() {
  return (
    <div>
        <section id="causes" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-start justify-between mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Urgent Causes Ready for Your Impact</h2>
              <p className="text-gray-500 text-[15px] max-w-md">
                Direct support where it&apos;s needed most. Your contribution bypasses red tape and goes
                straight to the front lines.
              </p>
            </div>
            <a
              href="#"
              className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 whitespace-nowrap mt-1 transition-colors shrink-0"
            >
              Explore All Causes
              <ArrowRight size={18} />
            </a>
          </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAUSES.map((cause: Cause, i: number) => (
            <CauseCard key={i} cause={cause} />
          ))}
        </div>
        </div>
      </section>
    </div>
  )
}

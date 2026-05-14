"use client";
import { StatCard } from "@/src/components/StatCard";
import { ChartLine, Eye, Shield } from "lucide-react";


const BuiltOnIntegrity = () => {
  return (
    <div>
      <div>
        <h3 className="flex justify-center text-3xl text-center font-extrabold text-secondaryText mb-6">
          Built on Integrity
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Transparency",
              desc: "Public ledgers ensure every transaction is traceable from the moment of donation to the final point of impact.",
              icon: <Eye className="w-6 h-6" color="#4648D4" />
            },
            {
              title: "Security",
              desc: "Audited smart contracts protect foundation assets and donor privacy.",
              icon: <Shield className="w-6 h-6" color="#009668" />
            },
            {
              title: "Impact",
              desc: "Our ecosystem prioritizes outcomes over intent, driving measurable change in communities globally.",
              icon: <ChartLine className="w-6 h-6" color="#4648D4" />
            },
          ].map((item, i) => (
           <StatCard key={i} variant={"lg"} label={item.desc} value={item.title} icon={<div className={`p-3.5 flex items-center justify-center bg-primary-light rounded-xl ${item.title==="Security"&&"bg-secondary/40"}`}>{item.icon}</div>}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuiltOnIntegrity;

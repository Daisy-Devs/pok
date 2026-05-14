import { Button } from "@/src/components/ui/button";


import { User, Leaf, Droplets } from "lucide-react";

const IMPACT_DATA = [
  {
    name: "Anonymous Donor",
    amount: "2.5 ETH",
    time: "2m ago",
    icon: User,
    bgColor: "bg-primary-light",
    iconColor: "text-indigo-600",
  },
  {
    name: "Reforest Africa",
    amount: "14,200 USDC",
    time: "5m ago",
    icon: Leaf,
    bgColor: "bg-secondary",
    iconColor: "text-emerald-600",
  },
  {
    name: "CleanWater Project",
    amount: "0.8 BTC",
    time: "12m ago",
    icon: Droplets,
    bgColor: "bg-primary-light",
    iconColor: "text-cyan-600",
  },
];

export default function ImpactWidget() {
  return (
    <div>
      <div className="rounded-2xl p-5 bg-[linear-gradient(135deg,#fff_0%,#f8f7ff_100%)] shadow-[0_20px_60px_rgba(99,102,241,.12),0_4px_16px_rgba(0,0,0,.06)]">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-text-secondary-color text-md">
            Real-time Impact
          </span>
          <div className="flex items-center gap-1.5">
            <Button variant={"green"} text="● LIVE" size={"short"} />
          </div>
        </div>

        <div className="mb-5 space-y-3">
          {IMPACT_DATA.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
              >
                {/* LEFT SIDE */}
                <div className="flex items-center gap-3">
                  {/* ICON */}
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-xl transition-transform hover:scale-105 ${item.bgColor}`}
                  >
                    <Icon size={16} className={item.iconColor} />
                  </div>

                  {/* TEXT */}
                  <div>
                    <p className="text-xs text-gray-500">{item.name}</p>
                    <p className="font-semibold">{item.amount}</p>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Total Contributed
          </p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-black text-tertiary">$42,891,044</p>
            <div className="flex flex-col ">
              <span className="text-[11px] font-bold text-green-700">
                +12.4%
              </span>
              <p className="text-[10px] text-gray-400 mt-0.5">vs last month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

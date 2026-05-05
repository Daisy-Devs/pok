import { Clock } from "lucide-react";
import { Campaign } from "./types";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const {
    title,
    description,
    image,
    raised,
    goal,
    progress,
    lastEdited,
    status,
  } = campaign;

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden w-full">
      {/* Image / Header */}
      <div className="relative h-40 bg-gray-200">
        {image && (
          <img src={image} alt="image" className="w-full h-full object-cover" />
        )}

        {/* Status Badge */}
        <span
          className="absolute top-3 left-3 px-3 py-1 text-xs rounded-full font-medium
          bg-emerald-100 text-emerald-700"
        >
          {status.toUpperCase()}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>

        {/* ACTIVE */}
        {status === "active" && (
          <>
            <div className="text-sm font-medium">{raised} ETH raised</div>

            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={12} /> days left
              </span>
              <span>Goal: {goal} ETH</span>
            </div>
          </>
        )}

        {/* DRAFT */}
        {status === "draft" && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Last edited {lastEdited}</span>
            <button className="text-indigo-600 font-medium">
              Edit Draft →
            </button>
          </div>
        )}

        {/* COMPLETED */}
        {status === "completed" && (
          <div className="text-emerald-600 font-semibold text-sm">
            100% FUNDED ({goal} ETH)
          </div>
        )}
      </div>
    </div>
  );
}

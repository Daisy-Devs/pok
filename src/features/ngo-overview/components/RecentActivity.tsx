type Activity = {
  title: string;
  description: string;
  time: string;
  color: "green" | "blue";
};

const activities: Activity[] = [
  {
    title: "Payout Disbursed",
    description:
      "2.5 ETH released for 'Solar Grid Alpha' project phase 2.",
    time: "2 HOURS AGO",
    color: "blue",
  },
  {
    title: "Transparency Audit Passed",
    description:
      "Smart contract #4421 verified receipt of latest donation batch.",
    time: "6 HOURS AGO",
    color: "green",
  },
  {
    title: "New Campaign Milestone",
    description:
      "'Ocean Cleanup' reached 50% of funding goal.",
    time: "YESTERDAY",
    color: "blue",
  },
];

export function RecentActivity() {
  return (
    <div className="flex flex-col gap-4">
      
      <h2 className="text-lg font-semibold">Recent Activity</h2>

      {activities.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-4 shadow-sm flex gap-3"
        >
          {/* Dot */}
          <span
            className={`mt-2 h-2 w-2 rounded-full ${
              item.color === "green"
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
          />

          {/* Content */}
          <div className="flex flex-col">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-gray-500">
              {item.description}
            </p>
            <span className="text-xs text-gray-400 mt-1">
              {item.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
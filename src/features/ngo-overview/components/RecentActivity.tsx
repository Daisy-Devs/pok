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
      
      <h2 className="text-xl font-bold">Recent Activity</h2>

      {activities.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-4 shadow-sm flex gap-3"
        >
          {/* Dot */}
          <span
            className={`mt-2 h-3 w-3 rounded-full ${
              item.color === "green"
                ? "bg-secondary"
                : "bg-primary"
            }`}
          />

          {/* Content */}
          <div className="flex flex-col">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-foreground">
              {item.description}
            </p>
            <span className="text-xs text-muted-foreground mt-1">
              {item.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
import { Doc } from "@/convex/_generated/dataModel";

export function StatsCards({ leads }: { leads: Doc<"leads">[] }) {
  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    won: leads.filter((l) => l.status === "closed-won").length,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Total Leads", value: stats.total, color: "from-[#6C63FF] to-[#9C95FF]" },
        { label: "New", value: stats.new, color: "from-blue-500 to-blue-400" },
        { label: "Qualified", value: stats.qualified, color: "from-purple-500 to-purple-400" },
        { label: "Won", value: stats.won, color: "from-green-500 to-green-400" },
      ].map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-[12px] border border-[#E5E5F0] p-5 shadow-sm"
        >
          <div
            className={`text-3xl font-syne font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
          >
            {stat.value}
          </div>
          <div className="text-[#6B7280] text-sm mt-1 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

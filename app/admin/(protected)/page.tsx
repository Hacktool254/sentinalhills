import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-500/15 text-blue-400 border border-blue-500/30" },
  contacted: { label: "Contacted", color: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" },
  qualified: { label: "Qualified", color: "bg-purple-500/15 text-purple-400 border border-purple-500/30" },
  "closed-won": { label: "Won ✓", color: "bg-green-500/15 text-green-400 border border-green-500/30" },
  "closed-lost": { label: "Lost", color: "bg-red-500/15 text-red-400 border border-red-500/30" },
};

const SERVICE_LABELS: Record<string, string> = {
  "lead-generation": "Lead Gen",
  website: "Website",
  app: "App",
  saas: "SaaS",
  unsure: "Unsure",
};

export default async function AdminDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let leads: any[] = [];
  let fetchError = false;

  try {
    leads = await convex.query(api.leads.getLeads, {});
  } catch {
    fetchError = true;
  }

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    won: leads.filter((l) => l.status === "closed-won").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-syne font-bold text-[#1A1A2E]">Leads Dashboard</h1>
        <p className="text-[#6B7280] mt-1 text-sm">Manage and track all incoming leads</p>
      </div>

      {/* Stats Cards */}
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

      {/* Leads Table */}
      <div className="bg-white rounded-[16px] border border-[#E5E5F0] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5F0]">
          <h2 className="font-syne font-semibold text-[#1A1A2E]">All Leads</h2>
        </div>

        {fetchError && (
          <div className="p-8 text-center text-red-500">
            Failed to load leads. Check your Convex connection.
          </div>
        )}

        {!fetchError && leads.length === 0 && (
          <div className="p-12 text-center text-[#9999BB]">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">No leads yet</p>
            <p className="text-sm mt-1">Leads submitted through your contact form will appear here.</p>
          </div>
        )}

        {!fetchError && leads.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F8FC] border-b border-[#E5E5F0]">
                <tr>
                  {["Name", "Business", "Service", "Budget", "Contact", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[#6B7280] font-medium text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F8]">
                {leads.map((lead) => {
                  const statusCfg = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.new;
                  const date = new Date(lead._creationTime).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <tr
                      key={lead._id}
                      className="hover:bg-[#F8F8FC] transition-colors"
                    >
                      <td className="px-5 py-4 font-medium text-[#1A1A2E] whitespace-nowrap">
                        <div>{lead.fullName}</div>
                        <div className="text-[#9999BB] text-xs font-normal">{lead.email}</div>
                      </td>
                      <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                        <div>{lead.businessName}</div>
                        <div className="text-[#9999BB] text-xs">{lead.industry}</div>
                      </td>
                      <td className="px-5 py-4 text-[#374151]">
                        {SERVICE_LABELS[lead.serviceType] ?? lead.serviceType}
                      </td>
                      <td className="px-5 py-4 text-[#374151] whitespace-nowrap">
                        {lead.budgetRange}
                      </td>
                      <td className="px-5 py-4 text-[#374151]">
                        <span className="inline-flex items-center gap-1 capitalize">
                          {lead.preferredContact === "whatsapp" && "💬"}
                          {lead.preferredContact === "email" && "📧"}
                          {lead.preferredContact === "call" && "📞"}
                          {lead.preferredContact}
                        </span>
                        {lead.whatsappNumber && (
                          <div className="text-[#9999BB] text-xs">{lead.whatsappNumber}</div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg.color}`}
                        >
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#9999BB] whitespace-nowrap text-xs">
                        {date}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

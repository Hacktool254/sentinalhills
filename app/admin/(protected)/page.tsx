import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { StatsCards } from "@/components/admin/StatsCards";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { Doc } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function AdminDashboard() {
  // Fetch initial leads securely on the server
  let leads: Doc<"leads">[] = [];
  let fetchError = false;

  try {
    leads = await convex.query(api.leads.getLeads, {});
  } catch {
    fetchError = true;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-syne font-bold text-[#1A1A2E]">Leads Dashboard</h1>
        <p className="text-[#6B7280] mt-1 text-sm">Manage and track all incoming leads</p>
      </div>

      <StatsCards leads={leads} />

      <div className="bg-white rounded-[16px] border border-[#E5E5F0] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5F0]">
          <h2 className="font-syne font-semibold text-[#1A1A2E]">All Leads</h2>
        </div>
        
        {fetchError && (
          <div className="p-8 text-center text-red-500">
            Failed to load leads. Check your Convex connection.
          </div>
        )}

        {!fetchError && (
          <LeadsTable initialLeads={leads} />
        )}
      </div>
    </div>
  );
}

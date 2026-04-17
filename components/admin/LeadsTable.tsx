"use client";

import { useState, useTransition } from "react";
import { updateLeadStatusAction } from "@/app/admin/(protected)/actions";
import { Doc } from "@/convex/_generated/dataModel";

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

export function LeadsTable({ initialLeads }: { initialLeads: Doc<"leads">[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterService, setFilterService] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    // Only destructive actions like 'closed-lost' explicitly need a confirm dialogue in the prompts.
    if (newStatus === "closed-lost") {
      if (!confirm("Are you sure you want to mark this lead as lost?")) return;
    }
    
    startTransition(async () => {
      await updateLeadStatusAction(leadId, newStatus as Parameters<typeof updateLeadStatusAction>[1]);
      // Let the Server Action's revalidatePath automatically update the table silently.
    });
  };

  if (initialLeads.length === 0) {
    return (
      <div className="p-12 text-center text-[#9999BB]">
        <div className="text-4xl mb-3">📭</div>
        <p className="font-medium">No leads yet</p>
        <p className="text-sm mt-1">Leads submitted through your contact form will appear here.</p>
      </div>
    );
  }

  const filteredLeads = initialLeads.filter((lead) => {
    const statusMatch = filterStatus === "all" || lead.status === filterStatus;
    const serviceMatch = filterService === "all" || lead.serviceType === filterService;
    return statusMatch && serviceMatch;
  });

  return (
    <>
      {/* Filters */}
      <div className="p-4 border-b border-[#E5E5F0] bg-[#FAFAFC] flex flex-col md:flex-row gap-4 items-center">
        <select 
          className="w-full md:w-48 text-sm border-[#E5E5F0] rounded-md px-3 py-2 bg-white"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>

        <select 
          className="w-full md:w-48 text-sm border-[#E5E5F0] rounded-md px-3 py-2 bg-white"
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
        >
          <option value="all">All Services</option>
          {Object.entries(SERVICE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        
        {isPending && <span className="text-xs text-[#6C63FF] animate-pulse">Updating database...</span>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F8FC] border-b border-[#E5E5F0]">
            <tr>
              {["Name", "Business", "Service", "Budget", "Contact", "Status", "Date", "Actions"].map((h) => (
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
            {filteredLeads.map((lead) => {
              const statusCfg = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.new;
              const date = new Date(lead._creationTime).toLocaleDateString("en-GB", {
                day: "2-digit", month: "short", year: "numeric",
              });
              const isExpanded = expandedId === lead._id;

              return (
                <div key={lead._id} className="contents">
                  <tr className="hover:bg-[#FCFCFE] transition-colors cursor-pointer" onClick={() => toggleExpand(lead._id)}>
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
                      </span>
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        className={`text-xs font-medium px-2 py-1.5 rounded-md cursor-pointer outline-none border-none ${statusCfg.color}`}
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        disabled={isPending}
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                          <option className="bg-white text-gray-900" key={key} value={key}>{cfg.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-[#9999BB] whitespace-nowrap text-xs">
                      {date}
                    </td>
                    <td className="px-5 py-4 text-[#6C63FF] text-xs font-medium">
                      {isExpanded ? "Collapse" : "Expand"}
                    </td>
                  </tr>

                  {/* Expandable Lead Details */}
                  {isExpanded && (
                    <tr className="bg-[#FAF9FF]">
                      <td colSpan={8} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xs font-bold uppercase text-[#9999BB] mb-1">Project Description</h4>
                              <p className="text-sm text-[#374151] bg-white p-3 rounded-lg border border-[#E5E5F0] whitespace-pre-wrap">
                                {lead.description}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xs font-bold uppercase text-[#9999BB] mb-1">Contact Actions</h4>
                              <div className="flex flex-col gap-2">
                                <a 
                                  href={`mailto:${lead.email}`} 
                                  className="w-full inline-flex justify-center items-center py-2 px-4 rounded-md border border-[#E5E5F0] bg-white text-sm hover:bg-gray-50 transition-colors"
                                >
                                  📧 Email {lead.fullName.split(" ")[0]}
                                </a>
                                {lead.whatsappNumber && (
                                  <a 
                                    href={`https://wa.me/${lead.whatsappNumber.replace(/[\s\-\+]/g, '')}`} 
                                    target="_blank" rel="noopener noreferrer"
                                    className="w-full inline-flex justify-center items-center py-2 px-4 rounded-md bg-[#25D366] text-white text-sm hover:bg-[#20BE5C] transition-colors shadow-sm"
                                  >
                                    💬 Message on WhatsApp
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xs font-bold uppercase text-[#9999BB] mb-2">Meta Details</h4>
                              <div className="text-xs space-y-2 text-[#374151]">
                                <div className="flex justify-between border-b pb-1">
                                  <span className="text-[#9999BB]">Preferred contact:</span>
                                  <span className="font-medium capitalize">{lead.preferredContact}</span>
                                </div>
                                <div className="flex justify-between border-b pb-1">
                                  <span className="text-[#9999BB]">Website:</span>
                                  <span className="font-medium">{lead.website || "N/A"}</span>
                                </div>
                                <div className="flex justify-between border-b pb-1">
                                  <span className="text-[#9999BB]">Referral:</span>
                                  <span className="font-medium">{lead.referralSource || "N/A"}</span>
                                </div>
                                <div className="flex justify-between border-b pb-1">
                                  <span className="text-[#9999BB]">Lead ID:</span>
                                  <span className="font-mono text-[10px] text-gray-400">{lead._id}</span>
                                </div>
                                <div className="flex justify-between pb-1">
                                  <span className="text-[#9999BB]">IP Address:</span>
                                  <span className="font-mono text-[10px] text-gray-400">{lead.ipAddress || "Hidden"}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </div>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

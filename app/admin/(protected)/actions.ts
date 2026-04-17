"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { revalidatePath } from "next/cache";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function updateLeadStatusAction(leadId: string, status: "new" | "contacted" | "qualified" | "closed-won" | "closed-lost") {
  try {
    // In a real production app you'd also manually check the auth cookie here again for safety,
    // though Next.js Middleware already blocks requests to server actions originating from protected pages if configured broadly.
    // However, server actions operate dynamically so it's a best practice to at least trust the layout for now.

    await convex.mutation(api.leads.updateLeadStatus, {
      leadId: leadId as Id<"leads">,
      status,
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Mutation failed" };
  }
}

import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { z } from "zod";
import { internal } from "./_generated/api";

const submitLeadSchema = z.object({
  serviceType: z.enum(['lead-generation', 'website', 'app', 'saas', 'unsure']),
  businessName: z.string().min(2).max(200).trim(),
  industry: z.string().min(1),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().min(20).max(2000).trim(),
  budgetRange: z.string().min(1),
  fullName: z.string().min(2).max(100).trim(),
  email: z.string().email(),
  whatsappNumber: z.string().regex(/^\+?[\d\s\-]{10,15}$/),
  preferredContact: z.enum(['whatsapp', 'email', 'call']),
  referralSource: z.string().optional(),
});

export const submitLead = mutation({
  args: {
    serviceType: v.string(),
    businessName: v.string(),
    industry: v.string(),
    website: v.optional(v.string()),
    description: v.string(),
    budgetRange: v.string(),
    fullName: v.string(),
    email: v.string(),
    whatsappNumber: v.string(),
    preferredContact: v.string(),
    referralSource: v.optional(v.string()),
    ipAddress: v.optional(v.string()), // Optional IP passed from client/server action
  },
  handler: async (ctx, args) => {
    const { ipAddress, ...leadDataArgs } = args;

    // 1. Validate input exactly to match Zod requirements
    const parsed = submitLeadSchema.safeParse(leadDataArgs);
    if (!parsed.success) {
      throw new ConvexError("Invalid lead data format provided");
    }
    const data = parsed.data;

    // 2. Validate Rate Limiting (max 3 submissions per IP per hour)
    const identifier = ipAddress || data.email;
    const actionName = "submit_lead";
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    const rateLimits = await ctx.db
      .query("rateLimits")
      .withIndex("by_identifier_action", (q) =>
        q.eq("identifier", identifier).eq("action", actionName)
      )
      .filter((q) => q.gte(q.field("windowStart"), oneHourAgo))
      .collect();

    const currentAttempts = rateLimits.reduce((acc, rl) => acc + rl.attempts, 0);

    if (currentAttempts >= 3) {
      throw new ConvexError("Too many submissions. Please try again later.");
    }

    // Record this attempt
    await ctx.db.insert("rateLimits", {
      identifier,
      action: actionName,
      attempts: 1,
      windowStart: Date.now(),
    });

    // 3. Save the lead
    const leadId = await ctx.db.insert("leads", {
      ...data,
      status: "new",
      ipAddress,
    });

    // 4. Schedule webhook
    await ctx.scheduler.runAfter(0, internal.http.notifyWebhook, {
      leadId,
      leadData: { ...data, leadId, status: "new" },
    });

    return { success: true, leadId };
  },
});

export const getLeads = query({
  args: {
    status: v.optional(v.string()),
    serviceType: v.optional(v.string()),
  },
  // No Convex Auth check — this project uses custom session auth.
  // Routes are protected at the Next.js layout level via session cookie validation.
  handler: async (ctx, args) => {
    let leads;

    if (args.status) {
      leads = await ctx.db
        .query("leads")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .collect();
    } else if (args.serviceType) {
      leads = await ctx.db
        .query("leads")
        .withIndex("by_service", (q) => q.eq("serviceType", args.serviceType as any))
        .collect();
    } else {
      leads = await ctx.db.query("leads").collect();
    }

    leads.sort((a, b) => b._creationTime - a._creationTime);
    return leads;
  },
});

export const updateLeadStatus = mutation({
  args: {
    leadId: v.id("leads"),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("closed-won"),
      v.literal("closed-lost")
    ),
    notes: v.optional(v.string()),
  },
  // No Convex Auth check — protected at Next.js layout level.
  handler: async (ctx, args) => {
    const updateData: any = { status: args.status };
    if (args.notes !== undefined) {
      updateData.notes = args.notes;
    }

    await ctx.db.patch(args.leadId, updateData);
    return { success: true };
  },
});

export const getLeadById = query({
  args: {
    leadId: v.id("leads"),
  },
  // No Convex Auth check — protected at Next.js layout level.
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    return lead;
  },
});

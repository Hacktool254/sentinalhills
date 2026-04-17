import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    // Service interest
    serviceType: v.union(
      v.literal("lead-generation"),
      v.literal("website"),
      v.literal("app"),
      v.literal("saas"),
      v.literal("unsure")
    ),
    // Business info
    businessName: v.string(),
    industry: v.string(),
    website: v.optional(v.string()),
    // Project details
    description: v.string(),
    budgetRange: v.string(),
    // Contact
    fullName: v.string(),
    email: v.string(),
    whatsappNumber: v.string(),
    preferredContact: v.union(
      v.literal("whatsapp"),
      v.literal("email"),
      v.literal("call")
    ),
    referralSource: v.optional(v.string()),
    // Internal tracking
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("closed-won"),
      v.literal("closed-lost")
    ),
    notes: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_service", ["serviceType"])
    .index("by_email", ["email"]),

  // Admin users (single record for now)
  adminUsers: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    sessionTokenHash: v.optional(v.string()), // Added for Phase 3
    lastLoginAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  // Rate limiting tracker
  rateLimits: defineTable({
    identifier: v.string(),   // IP or email
    action: v.string(),        // e.g. "submit_lead"
    attempts: v.number(),
    windowStart: v.number(),   // Unix timestamp
  }).index("by_identifier_action", ["identifier", "action"]),
});

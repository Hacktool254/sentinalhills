import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import * as bcrypt from "bcryptjs";
import { internal } from "./_generated/api";

// --- Internal Queries & Mutations for the Action ---

export const getAdminByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const checkAndRecordRateLimit = internalMutation({
  args: { identifier: v.string(), actionName: v.string(), maxAttempts: v.number(), windowMs: v.number() },
  handler: async (ctx, args) => {
    const windowStartLimit = Date.now() - args.windowMs;

    const rateLimits = await ctx.db
      .query("rateLimits")
      .withIndex("by_identifier_action", (q) =>
        q.eq("identifier", args.identifier).eq("action", args.actionName)
      )
      .filter((q) => q.gte(q.field("windowStart"), windowStartLimit))
      .collect();

    const currentAttempts = rateLimits.reduce((acc, rl) => acc + rl.attempts, 0);

    if (currentAttempts >= args.maxAttempts) {
      throw new ConvexError("Too many attempts. Try again in 15 minutes.");
    }

    await ctx.db.insert("rateLimits", {
      identifier: args.identifier,
      action: args.actionName,
      attempts: 1,
      windowStart: Date.now(),
    });

    return true;
  },
});

export const saveSessionTokenHash = internalMutation({
  args: { userId: v.id("adminUsers"), tokenHash: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      sessionTokenHash: args.tokenHash,
      lastLoginAt: Date.now(),
    });
  },
});

// --- Public Auth Endpoints ---

export const adminLogin = action({
  args: {
    email: v.string(),
    password: v.string(),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Rate Limit
    const identifier = args.ipAddress || args.email;
    await ctx.runMutation(internal.auth.checkAndRecordRateLimit, {
      identifier,
      actionName: "admin_login",
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000,
    });

    // 2. Fetch User
    const user = await ctx.runQuery(internal.auth.getAdminByEmail, {
      email: args.email,
    });

    if (!user) {
      throw new ConvexError("Invalid credentials");
    }

    // 3. Verify Password
    const isValid = await bcrypt.compare(args.password, user.passwordHash);
    if (!isValid) {
      throw new ConvexError("Invalid credentials");
    }

    // 4. Generate Token
    const rawToken = crypto.randomUUID() + "-" + Date.now();
    
    // Hash token to store in DB (avoid storing plaintext session tokens)
    // Here we can use a fast hash or bcrypt again. A simple SHA-256 via Web Crypto API is fine but bcrypt is already imported.
    const tokenHash = await bcrypt.hash(rawToken, 10);

    // 5. Save Token
    await ctx.runMutation(internal.auth.saveSessionTokenHash, {
      userId: user._id,
      tokenHash,
    });

    return { token: rawToken };
  },
});

export const validateSession = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    // We must find a user that has a sessionTokenHash which matches the sessionToken raw
    // Note: Since bcrypt incorporates a salt, we cannot query by the tokenHash.
    // In Convex, a more optimal approach for session tokens is generating a random string, storing it directly or doing a SHA256. 
    // Wait! The instructions say: "Hash it and compare against stored hash".
    // If we encrypt it with bcrypt, we have to iterate all admins to check passwords. Since it's an admin table with 1 record, iterating all admins is perfectly fine.
    
    const allAdmins = await ctx.db.query("adminUsers").collect();
    
    // This is fine for an admin table of 1-3 people. 
    // Since bcrypt.compare isn't available in v8 runtime directly (queries run in v8, actions in node), wait!
    // `bcryptjs` is pure JS, so it DOES work in Convex queries!
    for (const admin of allAdmins) {
      if (admin.sessionTokenHash) {
        const matches = await bcrypt.compare(args.sessionToken, admin.sessionTokenHash);
        if (matches) return { valid: true };
      }
    }
    
    return { valid: false };
  },
});

export const adminLogout = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const allAdmins = await ctx.db.query("adminUsers").collect();
    
    for (const admin of allAdmins) {
      if (admin.sessionTokenHash) {
        const matches = await bcrypt.compare(args.sessionToken, admin.sessionTokenHash);
        if (matches) {
          await ctx.db.patch(admin._id, { sessionTokenHash: undefined });
          return { success: true };
        }
      }
    }
    return { success: true };
  },
});

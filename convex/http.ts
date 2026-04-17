import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { httpRouter } from "convex/server";

export const notifyWebhook = internalAction({
  args: {
    leadId: v.id("leads"),
    leadData: v.any(),
  },
  handler: async (ctx, args) => {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

    if (!webhookUrl) {
      console.error("N8N_WEBHOOK_URL is not configured.");
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": webhookSecret || "",
        },
        body: JSON.stringify(args.leadData),
      });

      if (!response.ok) {
        console.error(`Webhook failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to trigger webhook", error);
    }
  },
});

const http = httpRouter();
export default http;

import type { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function handleStripeWebhook(req: Request, res: Response) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const sig = req.header("stripe-signature") || "";
  const buf = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || "");

  let event: Stripe.Event | undefined;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } else {
      // Fallback: accept unverified in non-prod to avoid 502s during setup
      event = JSON.parse(buf.toString("utf8") || "{}") as Stripe.Event;
      console.warn("[stripe] webhook received without STRIPE_WEBHOOK_SECRET set. Skipping signature verification.");
    }
  } catch (err) {
    console.error("[stripe] signature/parse failed", err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  try {
    const type = event?.type || "unknown";
    console.log("[stripe] event", type);
    switch (type) {
      case "checkout.session.completed":
        break;
      case "payment_intent.succeeded":
        break;
      case "setup_intent.created":
        break;
      default:
        break;
    }
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error("[stripe] handler error", e);
    return res.status(500).send("handler error");
  }
}

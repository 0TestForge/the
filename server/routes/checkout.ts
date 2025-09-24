import type { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

export async function handleCreateCheckout(req: Request, res: Response) {
  try {
    const { email, lines, currency } = req.body as { email?: string; lines: { name: string; qty: number; priceLocal: number }[]; currency: string };
    if (!Array.isArray(lines) || !lines.length) return res.status(400).json({ error: "No lines" });

    const origin = (req.headers.origin as string) || process.env.SITE_URL || "https://rocart.netlify.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      phone_number_collection: { enabled: false },
      automatic_tax: { enabled: false },
      billing_address_collection: "auto",
      line_items: lines.map((l) => ({
        quantity: l.qty,
        price_data: {
          currency: (currency || "USD").toLowerCase(),
          unit_amount: Math.max(50, Math.round((l.priceLocal / l.qty) * 100)),
          product_data: { name: l.name },
        },
      })),
      customer_email: email && /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email) ? email : undefined,
      success_url: `${origin}/?success=1`,
      cancel_url: `${origin}/grow?canceled=1`,
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (e: any) {
    console.error("[stripe] checkout create error", e);
    return res.status(500).json({ error: e?.message || "server_error" });
  }
}

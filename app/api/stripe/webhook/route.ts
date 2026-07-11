import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { fulfillPaidCheckoutSession } from "@/lib/booking/fulfillCheckout";
import { releaseUnpaidBookingHold } from "@/lib/booking/holds";
import { getStripeWebhookSecret } from "@/lib/booking/config";
import { getStripe } from "@/lib/stripe/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = getStripeWebhookSecret();
  if (!stripe || !secret) {
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid payload";
    console.error("stripe webhook signature", msg);
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const result = await fulfillPaidCheckoutSession(session);

    if (!result.ok) {
      console.error("webhook fulfill failed", session.id, result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ received: true, status: result.status });
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.id) {
      await releaseUnpaidBookingHold(session.id);
    }
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}

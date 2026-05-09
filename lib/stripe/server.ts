import "server-only";

import Stripe from "stripe";
import { getStripeSecretKey } from "@/lib/booking/config";

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = getStripeSecretKey();
  if (!key) return null;
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key);
  }
  return stripeSingleton;
}

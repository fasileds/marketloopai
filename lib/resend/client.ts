import { Resend } from "resend";

/** From address for blog post notification emails. Must be on a domain verified in Resend. */
export const RESEND_BLOG_FROM =
  process.env.RESEND_FROM_EMAIL ?? "MarketLoopAI <onboarding@resend.dev>";

/** From address for waitlist welcome emails — kept separate from blog notifications. */
export const RESEND_WELCOME_FROM =
  process.env.RESEND_WELCOME_FROM_EMAIL ?? "MarketLoopAI <hello@marketloopai.com>";

let client: Resend | null = null;

/** Returns null when RESEND_API_KEY isn't configured, so callers can no-op gracefully. */
export function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

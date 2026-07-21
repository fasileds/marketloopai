import { customAlphabet } from "nanoid";
import { NextResponse } from "next/server";

import { waitlistWelcomeEmail } from "@/lib/email/waitlist-welcome";
import { getResendClient, RESEND_WELCOME_FROM } from "@/lib/resend/client";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { waitlistSchema } from "@/lib/validations/waitlist";

async function sendWelcomeEmail(name: string, email: string, referralCode: string) {
  const resend = getResendClient();
  if (!resend) return; // Resend not configured yet — skip silently.

  try {
    const { subject, html } = waitlistWelcomeEmail({ siteName: "MarketLoopAI", name, referralCode });
    await resend.emails.send({ from: RESEND_WELCOME_FROM, to: email, subject, html });
  } catch (err) {
    // Never fail the signup because the welcome email didn't go out.
    console.error("waitlist welcome email failed", err);
  }
}

// Unambiguous alphabet (no 0/O/1/I) so referral codes are easy to read aloud/type.
const generateReferralCode = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 7);

const POSTGRES_UNIQUE_VIOLATION = "23505";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form for errors.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const {
    name,
    email,
    company,
    website,
    businessType,
    companySize,
    monthlyAdSpend,
    interestedFeatures,
    country,
    referredBy,
  } = parsed.data;

  const supabase = createServiceRoleClient();

  // Retry once on referral_code collision (astronomically unlikely, but the
  // column is unique so a retry is cheap insurance).
  for (let attempt = 0; attempt < 2; attempt++) {
    const { data, error } = await supabase
      .from("waitlist")
      .insert({
        name,
        email: email.toLowerCase(),
        company: company || null,
        website: website || null,
        business_type: businessType ?? null,
        company_size: companySize ?? null,
        monthly_ad_spend: monthlyAdSpend || null,
        interested_features: interestedFeatures ?? null,
        country: country || null,
        referral_code: generateReferralCode(),
        referred_by: referredBy || null,
      })
      .select("referral_code")
      .single();

    if (!error) {
      await sendWelcomeEmail(name, email.toLowerCase(), data.referral_code);
      return NextResponse.json({ referralCode: data.referral_code }, { status: 201 });
    }

    if (error.code === POSTGRES_UNIQUE_VIOLATION && error.message.includes("referral_code")) {
      continue; // regenerate and retry
    }

    if (error.code === POSTGRES_UNIQUE_VIOLATION) {
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 },
      );
    }

    console.error("waitlist insert failed", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 },
  );
}

import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { WaitlistCtaBand } from "@/components/sections/waitlist-cta-band";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

import { PricingContent, type PlanTextMap } from "./pricing-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marketloopai.com";

const PRICING_TITLE = "Pricing";
const PRICING_DESCRIPTION =
  "Simple, transparent pricing for AI content generation, humanization & ranking, video ad generation, and multi-platform ad campaign management. Join the waitlist to lock in launch pricing.";

export const metadata: Metadata = {
  title: PRICING_TITLE,
  description: PRICING_DESCRIPTION,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: PRICING_TITLE,
    description: PRICING_DESCRIPTION,
    url: `${SITE_URL}/pricing`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PRICING_TITLE,
    description: PRICING_DESCRIPTION,
  },
};

const PLAN_TEXT_DEFAULTS: Record<string, { name: string; tagline: string; features: string[] }> = {
  free: {
    name: "Free",
    tagline: "Try the basics",
    features: [
      "10 AI content generations/month",
      "1 AI video/month",
      "5 AI images/month",
      "Connect all supported platforms",
      "Basic scheduling",
      "Community support",
    ],
  },
  starter: {
    name: "Starter",
    tagline: "For solo creators & small teams",
    features: [
      "100 AI content generations/month",
      "5 AI videos/month",
      "30 AI images/month",
      "20 AI ad generations/month",
      "Connect all supported platforms",
      "Content repurposing",
      "AI humanization",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    tagline: "For growing marketing teams",
    features: [
      "300 AI content generations/month",
      "20 AI videos/month",
      "100 AI images/month",
      "100 AI ad generations/month",
      "Connect all supported platforms",
      "Team collaboration",
      "Priority support",
    ],
  },
  agency: {
    name: "Agency",
    tagline: "For agencies managing multiple brands",
    features: [
      "1,000 AI content generations/month",
      "80 AI videos/month",
      "300 AI images/month",
      "300 AI ad generations/month",
      "Connect all supported platforms",
      "Multiple workspaces",
      "Team members",
      "Advanced analytics",
      "Dedicated onboarding",
    ],
  },
};

export default async function PricingPage() {
  const content = await getSiteContent();

  const planText: PlanTextMap = Object.fromEntries(
    Object.entries(PLAN_TEXT_DEFAULTS).map(([id, defaults]) => [
      id,
      {
        name: getText(content, `pricing.plans.${id}.name`, defaults.name),
        tagline: getText(content, `pricing.plans.${id}.tagline`, defaults.tagline),
        features: defaults.features.map((fallback, i) =>
          getText(content, `pricing.plans.${id}.features.${i}`, fallback),
        ),
      },
    ]),
  );

  return (
    <>
      <PageHero
        eyebrow={getText(content, "pagehero.pricing.eyebrow")}
        eyebrowKey="pagehero.pricing.eyebrow"
        title={getText(content, "pagehero.pricing.title")}
        titleKey="pagehero.pricing.title"
        description={getText(content, "pagehero.pricing.description")}
        descriptionKey="pagehero.pricing.description"
      />
      <PricingContent planText={planText} />

      <WaitlistCtaBand
        title={getText(content, "pricing.cta.title", "Get launch pricing as an early member")}
        titleKey="pricing.cta.title"
      />
    </>
  );
}

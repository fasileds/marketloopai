import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { WaitlistCtaBand } from "@/components/sections/waitlist-cta-band";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

import { PricingContent, type PlanTextMap } from "./pricing-content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for AI content generation, humanization & ranking, video ad generation, and multi-platform ad campaign management. Join the waitlist to lock in launch pricing.",
};

const PLAN_TEXT_DEFAULTS: Record<string, { name: string; tagline: string; features: string[] }> = {
  free: {
    name: "Free",
    tagline: "Try the basics",
    features: ["1 workspace", "AI content generation for 1 platform", "Basic humanization & AI judging", "Community support"],
  },
  starter: {
    name: "Starter",
    tagline: "For solo creators & small teams",
    features: [
      "Everything in Free",
      "AI video ad generation (limited)",
      "Content generation for 5 platforms",
      "AI content repurposing",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    tagline: "For growing marketing teams",
    features: [
      "Everything in Starter",
      "Unlimited AI video ad generation",
      "Content generation for all platforms",
      "Multi-platform ad campaign management",
      "Team collaboration",
      "Priority support",
    ],
  },
  agency: {
    name: "Agency",
    tagline: "For agencies managing multiple brands",
    features: [
      "Everything in Pro",
      "Multiple client workspaces",
      "Client-facing dashboards",
      "Advanced ranking & performance analytics",
      "Dedicated onboarding",
    ],
  },
  enterprise: {
    name: "Enterprise",
    tagline: "For large organizations",
    features: [
      "Everything in Agency",
      "Custom integrations",
      "SSO & advanced security controls",
      "Dedicated success manager",
      "Custom contract & SLA",
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

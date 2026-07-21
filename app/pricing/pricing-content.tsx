"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { useState } from "react";

import Link from "next/link";

import { EditableText } from "@/components/editing/editable-text";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    id: "free",
    name: "Free",
    tagline: "Try the basics",
    monthly: 0,
    yearly: 0,
    featured: false,
    features: ["1 workspace", "AI content generation for 1 platform", "Basic humanization & AI judging", "Community support"],
  },
  {
    id: "starter",
    name: "Starter",
    tagline: "For solo creators & small teams",
    monthly: 29,
    yearly: 24,
    featured: false,
    features: [
      "Everything in Free",
      "AI video ad generation (limited)",
      "Content generation for 5 platforms",
      "AI content repurposing",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For growing marketing teams",
    monthly: 79,
    yearly: 65,
    featured: true,
    features: [
      "Everything in Starter",
      "Unlimited AI video ad generation",
      "Content generation for all platforms",
      "Multi-platform ad campaign management",
      "Team collaboration",
      "Priority support",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    tagline: "For agencies managing multiple brands",
    monthly: 199,
    yearly: 165,
    featured: false,
    features: [
      "Everything in Pro",
      "Multiple client workspaces",
      "Client-facing dashboards",
      "Advanced ranking & performance analytics",
      "Dedicated onboarding",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For large organizations",
    monthly: null,
    yearly: null,
    featured: false,
    features: [
      "Everything in Agency",
      "Custom integrations",
      "SSO & advanced security controls",
      "Dedicated success manager",
      "Custom contract & SLA",
    ],
  },
] as const;

const COMPARISON_ROWS = [
  { label: "AI content generation & repurposing", free: true, starter: true, pro: true, agency: true, enterprise: true },
  { label: "AI video ad generation", free: false, starter: "Limited", pro: true, agency: true, enterprise: true },
  { label: "Multi-platform ad campaign management", free: false, starter: false, pro: true, agency: true, enterprise: true },
  { label: "Team collaboration", free: false, starter: false, pro: true, agency: true, enterprise: true },
  { label: "Multiple client workspaces", free: false, starter: false, pro: false, agency: true, enterprise: true },
  { label: "SSO & advanced security", free: false, starter: false, pro: false, agency: false, enterprise: true },
] as const;

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="mx-auto size-4 text-primary" aria-label="Included" />;
  if (value === false)
    return <Minus className="mx-auto size-4 text-muted-foreground/40" aria-label="Not included" />;
  return <span className="text-xs text-muted-foreground">{value}</span>;
}

export type PlanTextMap = Record<string, { name: string; tagline: string; features: string[] }>;

export function PricingContent({ planText }: { planText: PlanTextMap }) {
  const [yearly, setYearly] = useState(true);

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-10 flex items-center justify-center gap-3">
        <span className={`text-sm ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          onClick={() => setYearly((v) => !v)}
          className="relative h-6 w-11 shrink-0 rounded-full bg-secondary transition-colors data-[on=true]:bg-primary"
          data-on={yearly}
        >
          <motion.span
            className="absolute top-0.5 left-0.5 size-5 rounded-full bg-foreground"
            animate={{ x: yearly ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </button>
        <span className={`text-sm ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
          Yearly <span className="text-primary">(save ~20%)</span>
        </span>
      </div>

      <div className="mx-auto mt-14 grid max-w-[100rem] gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {PLANS.map((plan) => {
          const text = planText[plan.id];
          return (
          <div
            key={plan.id}
            className={`glass noise-overlay flex flex-col rounded-2xl p-6 ${
              plan.featured ? "glow-border relative lg:-translate-y-3 lg:shadow-[0_20px_60px_-20px_var(--glow-primary)]" : ""
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground">
                Most popular
              </span>
            )}
            <h3 className="text-base font-semibold">
              <EditableText contentKey={`pricing.plans.${plan.id}.name`} value={text.name} />
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              <EditableText contentKey={`pricing.plans.${plan.id}.tagline`} value={text.tagline} />
            </p>

            <div className="mt-5 flex items-baseline gap-1">
              <AnimatePresence mode="wait">
                {plan.monthly === null ? (
                  <motion.span
                    key="custom"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-3xl font-semibold"
                  >
                    Custom
                  </motion.span>
                ) : (
                  <motion.span
                    key={yearly ? "yearly" : "monthly"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-3xl font-semibold"
                  >
                    ${yearly ? plan.yearly : plan.monthly}
                  </motion.span>
                )}
              </AnimatePresence>
              {plan.monthly !== null && (
                <span className="text-sm text-muted-foreground">/mo</span>
              )}
            </div>

            <ul className="mt-6 flex-1 space-y-2.5">
              {text.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                  <EditableText
                    contentKey={`pricing.plans.${plan.id}.features.${featureIndex}`}
                    value={feature}
                  />
                </li>
              ))}
            </ul>

            <Button
              className="mt-6 w-full"
              variant={plan.featured ? "default" : "outline"}
              nativeButton={false}
              render={<Link href="/#waitlist" />}
            >
              Join Waitlist
            </Button>
          </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Launch pricing shown above is planned and may change before general availability.
      </p>

      <div className="mx-auto mt-20 max-w-5xl overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left font-medium text-muted-foreground">Feature</th>
              {PLANS.map((plan) => (
                <th key={plan.id} className="p-3 text-center font-medium">
                  {planText[plan.id].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-secondary/40" : ""}>
                <td className="rounded-l-lg p-3 text-left text-muted-foreground">{row.label}</td>
                <td className="p-3 text-center">
                  <Cell value={row.free} />
                </td>
                <td className="p-3 text-center">
                  <Cell value={row.starter} />
                </td>
                <td className="p-3 text-center">
                  <Cell value={row.pro} />
                </td>
                <td className="p-3 text-center">
                  <Cell value={row.agency} />
                </td>
                <td className="rounded-r-lg p-3 text-center">
                  <Cell value={row.enterprise} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}

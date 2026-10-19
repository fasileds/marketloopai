import type { Metadata } from "next";
import {
  Building2,
  Database,
  Gauge,
  Lock,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

import { EditableHeading } from "@/components/editing/editable-heading";
import { EditableText } from "@/components/editing/editable-text";
import { PageHero } from "@/components/layout/page-hero";
import { getSiteContent, getText } from "@/lib/content/get-site-content";
import { LEGAL_DOCUMENTS } from "@/lib/legal/constants";

const DESCRIPTION =
  "How MarketLoopAI protects accounts, AI video and creative, campaign data, and connected ad platforms across the SaaS.";

export const metadata: Metadata = {
  title: "Trust Center",
  description: DESCRIPTION,
  alternates: { canonical: "/trust" },
  openGraph: {
    title: "Trust Center",
    description: DESCRIPTION,
    url: "/trust",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trust Center",
    description: DESCRIPTION,
  },
};

const PILLARS = [
  {
    title: "Security",
    description:
      "TLS in transit, encrypted storage, signed URLs for private media, and server-only secrets for generation, billing, and platform tokens.",
    icon: ShieldCheck,
    href: "/security",
  },
  {
    title: "Privacy",
    description:
      "We process prompts, videos, campaigns, and ad-account data to run the product — not to sell it. You can request access, export, or deletion as described in the Privacy Policy.",
    icon: UserCheck,
    href: "/privacy",
  },
  {
    title: "Tenant isolation",
    description:
      "Workspaces are isolated with database row-level security and API authorization so one organization cannot read another's creative or campaigns.",
    icon: Lock,
    href: "/security",
  },
  {
    title: "Infrastructure",
    description:
      "Web app on Vercel, data and auth on Supabase, payments on Stripe, and GPU workers for video generation that receive only the job they need to run.",
    icon: Database,
    href: "/security",
  },
  {
    title: "Reliability",
    description:
      "Job queues, credit reservation, monitoring, and incident response so generation and publishing can fail safely rather than silently.",
    icon: Gauge,
    href: "/security",
  },
  {
    title: "Compliance readiness",
    description:
      "Practices aligned with GDPR and CCPA for account, waitlist, and Customer Content, with a roadmap toward formal certifications as we scale.",
    icon: Building2,
    href: "#compliance",
  },
];

const COMPLIANCE = [
  {
    name: "GDPR",
    status: "Aligned",
    description:
      "Contract, legitimate interests, and consent bases as described in the Privacy Policy, including AI job payloads and connected-platform data.",
  },
  {
    name: "CCPA",
    status: "Aligned",
    description:
      "California rights to know, delete, correct, and opt out of sale or sharing. We do not sell personal information.",
  },
  {
    name: "SOC 2",
    status: "Planned",
    description: "A formal SOC 2 Type II audit is on the roadmap as the SaaS and customer base mature.",
  },
  {
    name: "ISO 27001",
    status: "Planned",
    description: "ISO 27001 is on the roadmap for future evaluation; we do not claim this certification today.",
  },
  {
    name: "EU AI Act",
    status: "Aligned",
    description:
      "We treat customers as deployers of AI creative tools, require human review, and support synthetic-media transparency as described in the AI Policy. We do not claim high-risk certification.",
  },
] as const;

export default async function TrustPage() {
  const content = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow={getText(content, "trust.pagehero.eyebrow", "Trust Center")}
        eyebrowKey="trust.pagehero.eyebrow"
        title={getText(
          content,
          "trust.pagehero.title",
          "Built to be trusted with your creative and campaigns",
        )}
        titleKey="trust.pagehero.title"
        description={getText(
          content,
          "trust.pagehero.description",
          "MarketLoopAI is a SaaS for AI video generation and ad campaign management. Security, privacy, and tenant isolation apply to the whole product — not only the public website.",
        )}
        descriptionKey="trust.pagehero.description"
      />

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[100rem] gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className="glow-border glass group relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <pillar.icon className="size-5" aria-hidden />
              </div>
              <h3 className="text-base font-medium">
                <EditableText
                  contentKey={`trust.pillar.${index}.title`}
                  value={getText(content, `trust.pillar.${index}.title`, pillar.title)}
                />
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <EditableText
                  multiline
                  contentKey={`trust.pillar.${index}.description`}
                  value={getText(content, `trust.pillar.${index}.description`, pillar.description)}
                />
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section id="compliance" className="section-panel scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[100rem]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              <EditableHeading
                contentKey="trust.compliance.title"
                value={getText(content, "trust.compliance.title", "Compliance roadmap")}
              />
            </h2>
            <p className="mt-4 text-muted-foreground">
              <EditableText
                multiline
                contentKey="trust.compliance.description"
                value={getText(
                  content,
                  "trust.compliance.description",
                  "We haven't claimed certifications we don't hold. Here's where we stand today, transparently.",
                )}
              />
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {COMPLIANCE.map((item, index) => (
              <div key={item.name} className="glass flex items-start justify-between gap-4 rounded-2xl p-6">
                <div>
                  <h3 className="text-base font-medium">
                    <EditableText
                      contentKey={`trust.compliance.${index}.name`}
                      value={getText(content, `trust.compliance.${index}.name`, item.name)}
                    />
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <EditableText
                      multiline
                      contentKey={`trust.compliance.${index}.description`}
                      value={getText(content, `trust.compliance.${index}.description`, item.description)}
                    />
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    item.status === "Aligned"
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[100rem]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Legal documents</h2>
            <p className="mt-4 text-muted-foreground">
              Terms, privacy, the DPA, and related policies apply to the whole SaaS — not only this
              site. See the{" "}
              <Link href="/legal" className="text-foreground underline underline-offset-2">
                legal center
              </Link>
              .
            </p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LEGAL_DOCUMENTS.filter((doc) => doc.href !== "/trust").map((doc) => (
              <Link
                key={doc.href}
                href={doc.href}
                className="glass rounded-2xl px-5 py-4 text-sm transition-colors hover:text-foreground"
              >
                <span className="font-medium text-foreground">{doc.title}</span>
                <span className="mt-1 block text-muted-foreground">{doc.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

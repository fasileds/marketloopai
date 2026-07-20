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

export const metadata: Metadata = {
  title: "Trust Center",
  description:
    "How MarketLoopAI approaches security, privacy, reliability, and compliance readiness.",
};

const PILLARS = [
  {
    title: "Security",
    description: "TLS encryption in transit, database-level row security, and server-only credentials for sensitive operations.",
    icon: ShieldCheck,
    href: "/security",
  },
  {
    title: "Privacy",
    description: "Clear data handling practices, minimal collection, and user rights to access, export, or delete your data.",
    icon: UserCheck,
    href: "/privacy",
  },
  {
    title: "Data Protection",
    description: "Row Level Security policies restrict data access at the database layer, not just in application code.",
    icon: Lock,
    href: "/security",
  },
  {
    title: "Infrastructure",
    description: "Built on Vercel and Supabase — established providers with their own dedicated security and reliability programs.",
    icon: Database,
    href: "/security",
  },
  {
    title: "Reliability",
    description: "Designed for high availability, with monitoring and incident response practices that scale as we grow.",
    icon: Gauge,
    href: "/security",
  },
  {
    title: "Compliance readiness",
    description: "Built with GDPR and CCPA principles in mind from day one, with a roadmap toward formal certifications.",
    icon: Building2,
    href: "#compliance",
  },
];

const COMPLIANCE = [
  { name: "GDPR", status: "Aligned", description: "Data handling practices follow GDPR principles for EEA/UK users." },
  { name: "CCPA", status: "Aligned", description: "California residents' rights to know, delete, and opt out are supported." },
  { name: "SOC 2", status: "Planned", description: "Formal SOC 2 audit is on our roadmap as we approach general availability." },
  { name: "ISO 27001", status: "Planned", description: "ISO 27001 certification is on our roadmap for future evaluation." },
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
          "Built to be trusted with your data",
        )}
        titleKey="trust.pagehero.title"
        description={getText(
          content,
          "trust.pagehero.description",
          "We're pre-launch, but security and privacy are foundational — not an afterthought we'll bolt on later.",
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
    </>
  );
}

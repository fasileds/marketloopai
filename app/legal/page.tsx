import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { LEGAL_DOCUMENTS, LEGAL_GROUP_LABELS, LEGAL_LAST_UPDATED } from "@/lib/legal/constants";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const DESCRIPTION =
  "MarketLoopAI legal documents for the full SaaS: terms, privacy, DPA, AI policy, copyright, refunds, and related policies for Europe, the United States, and other regions.";

export const metadata: Metadata = {
  title: "Legal",
  description: DESCRIPTION,
  alternates: { canonical: "/legal" },
  openGraph: {
    title: "Legal",
    description: DESCRIPTION,
    url: "/legal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Legal",
    description: DESCRIPTION,
  },
};

const GROUPS = ["core", "privacy", "product", "trust"] as const;

export default async function LegalIndexPage() {
  const content = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow={getText(content, "legalindex.pagehero.eyebrow", "Legal")}
        eyebrowKey="legalindex.pagehero.eyebrow"
        title={getText(
          content,
          "legalindex.pagehero.title",
          "Policies for the whole MarketLoopAI SaaS",
        )}
        titleKey="legalindex.pagehero.title"
        description={getText(
          content,
          "legalindex.pagehero.description",
          "These documents apply to the marketing site and the application: AI content and video generation, publishing, and ad campaign management. They are drafted to work together. Last updated " +
            LEGAL_LAST_UPDATED +
            ".",
        )}
        descriptionKey="legalindex.pagehero.description"
      />

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[100rem] flex-col gap-14">
          {GROUPS.map((group) => (
            <div key={group}>
              <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                {LEGAL_GROUP_LABELS[group]}
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {LEGAL_DOCUMENTS.filter((doc) => doc.group === group).map((doc) => (
                  <Link
                    key={doc.href}
                    href={doc.href}
                    className="glow-border glass rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <h3 className="text-base font-medium">{doc.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{doc.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { Solutions } from "@/components/sections/solutions";
import { SOLUTIONS_DEFAULTS } from "@/components/sections/solutions.data";
import { WaitlistCtaBand } from "@/components/sections/waitlist-cta-band";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marketloopai.com";

const SOLUTIONS_TITLE = "Solutions";
const SOLUTIONS_DESCRIPTION =
  "See how MarketLoopAI generates, ranks, and adapts content and ad creative for e-commerce brands, SaaS companies, personal brands, agencies, and small businesses.";

export const metadata: Metadata = {
  title: SOLUTIONS_TITLE,
  description: SOLUTIONS_DESCRIPTION,
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: SOLUTIONS_TITLE,
    description: SOLUTIONS_DESCRIPTION,
    url: `${SITE_URL}/solutions`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SOLUTIONS_TITLE,
    description: SOLUTIONS_DESCRIPTION,
  },
};

export default async function SolutionsPage() {
  const content = await getSiteContent();

  const items = SOLUTIONS_DEFAULTS.map((solution, index) => ({
    id: solution.id,
    label: getText(content, `solutions.items.${index}.label`, solution.label),
    headline: getText(content, `solutions.items.${index}.headline`, solution.headline),
    points: solution.points.map((fallback, pointIndex) =>
      getText(content, `solutions.items.${index}.points.${pointIndex}`, fallback),
    ),
  }));

  return (
    <>
      <PageHero
        eyebrow={getText(content, "pagehero.solutions.eyebrow")}
        eyebrowKey="pagehero.solutions.eyebrow"
        title={getText(content, "pagehero.solutions.title")}
        titleKey="pagehero.solutions.title"
        description={getText(content, "pagehero.solutions.description")}
        descriptionKey="pagehero.solutions.description"
      />
      <Solutions items={items} />

      <WaitlistCtaBand
        title={getText(content, "solutions.cta.title", "See it working for your business")}
        titleKey="solutions.cta.title"
      />
    </>
  );
}

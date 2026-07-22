import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { FeaturesBento } from "@/components/sections/features-bento";
import { FEATURES_DEFAULTS } from "@/components/sections/features-bento.data";
import { WaitlistCtaBand } from "@/components/sections/waitlist-cta-band";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marketloopai.com";

const FEATURES_TITLE = "Features";
const FEATURES_DESCRIPTION =
  "One idea in, complete content and advertising creative out: AI content repurposing, multi-platform content generation, humanization and AI judging, content ranking, video ad generation, scene-by-scene storyboards, and multi-platform ad management.";

export const metadata: Metadata = {
  title: FEATURES_TITLE,
  description: FEATURES_DESCRIPTION,
  alternates: { canonical: "/features" },
  openGraph: {
    title: FEATURES_TITLE,
    description: FEATURES_DESCRIPTION,
    url: `${SITE_URL}/features`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: FEATURES_TITLE,
    description: FEATURES_DESCRIPTION,
  },
};

export default async function FeaturesPage() {
  const content = await getSiteContent();

  const features = FEATURES_DEFAULTS.map((feature, index) => ({
    title: getText(content, `features.bento.${index}.title`, feature.title),
    description: getText(content, `features.bento.${index}.description`, feature.description),
  }));

  return (
    <>
      <PageHero
        eyebrow={getText(content, "pagehero.features.eyebrow")}
        eyebrowKey="pagehero.features.eyebrow"
        title={getText(content, "pagehero.features.title")}
        titleKey="pagehero.features.title"
        description={getText(content, "pagehero.features.description")}
        descriptionKey="pagehero.features.description"
      />
      <FeaturesBento items={features} />

      <WaitlistCtaBand
        title={getText(content, "features.cta.title", "Want early access to every feature?")}
        titleKey="features.cta.title"
      />
    </>
  );
}

import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { FeaturesBento } from "@/components/sections/features-bento";
import { FEATURES_DEFAULTS } from "@/components/sections/features-bento.data";
import { WaitlistCtaBand } from "@/components/sections/waitlist-cta-band";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

export const metadata: Metadata = {
  title: "Features",
  description:
    "AI content generation, video, publishing, ad campaign management, and analytics — everything MarketLoopAI automates from one platform.",
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

import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { Integrations } from "@/components/sections/integrations";
import { INTEGRATIONS_DEFAULTS } from "@/components/sections/integrations.data";
import { WaitlistCtaBand } from "@/components/sections/waitlist-cta-band";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "MarketLoopAI connects to TikTok, Snapchat, LinkedIn, Instagram, Facebook, X, Google Ads, Shopify, WordPress, WooCommerce, YouTube, and more.",
};

export default async function IntegrationsPage() {
  const content = await getSiteContent();

  const items = INTEGRATIONS_DEFAULTS.map((integration, index) => ({
    name: getText(content, `integrations.items.${index}.name`, integration.name),
  }));

  return (
    <>
      <PageHero
        eyebrow={getText(content, "pagehero.integrations.eyebrow")}
        eyebrowKey="pagehero.integrations.eyebrow"
        title={getText(content, "pagehero.integrations.title")}
        titleKey="pagehero.integrations.title"
        description={getText(content, "pagehero.integrations.description")}
        descriptionKey="pagehero.integrations.description"
      />
      <Integrations items={items} />

      <WaitlistCtaBand
        title={getText(content, "integrations.cta.title", "Don't see your platform? Tell us")}
        titleKey="integrations.cta.title"
      />
    </>
  );
}

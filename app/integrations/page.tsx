import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { Integrations } from "@/components/sections/integrations";
import { INTEGRATIONS_DEFAULTS } from "@/components/sections/integrations.data";
import { WaitlistCtaBand } from "@/components/sections/waitlist-cta-band";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marketloopai.com";

const INTEGRATIONS_TITLE = "Integrations";
const INTEGRATIONS_DESCRIPTION =
  "MarketLoopAI publishes to LinkedIn, TikTok, Snapchat, X, Facebook, and Instagram, and manages ad campaigns across TikTok Ads, Snapchat Ads, X Ads, Google Ads, and Facebook/Meta Ads.";

export const metadata: Metadata = {
  title: INTEGRATIONS_TITLE,
  description: INTEGRATIONS_DESCRIPTION,
  alternates: { canonical: "/integrations" },
  openGraph: {
    title: INTEGRATIONS_TITLE,
    description: INTEGRATIONS_DESCRIPTION,
    url: `${SITE_URL}/integrations`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: INTEGRATIONS_TITLE,
    description: INTEGRATIONS_DESCRIPTION,
  },
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

      <p className="mx-auto max-w-[100rem] px-4 pb-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
        Connecting a platform is subject to our{" "}
        <Link href="/platform-integrations" className="text-foreground underline underline-offset-2">
          Platform Integrations Policy
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-foreground underline underline-offset-2">
          Privacy Policy
        </Link>
        . Delete connected data anytime via{" "}
        <Link href="/data-deletion" className="text-foreground underline underline-offset-2">
          User Data Deletion
        </Link>
        .
      </p>
      <WaitlistCtaBand
        title={getText(content, "integrations.cta.title", "Don't see your platform? Tell us")}
        titleKey="integrations.cta.title"
      />
    </>
  );
}

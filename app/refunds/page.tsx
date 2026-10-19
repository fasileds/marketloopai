import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { buildLegalSections, type RawLegalSection } from "@/lib/legal/build-sections";
import { LEGAL_INDEX_SENTENCE, LEGAL_LAST_UPDATED } from "@/lib/legal/constants";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const DESCRIPTION =
  "MarketLoopAI refund rules for subscriptions, generation credits, consumer cooling-off rights, and third-party ad spend.";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: DESCRIPTION,
  alternates: { canonical: "/refunds" },
  openGraph: {
    title: "Refund Policy",
    description: DESCRIPTION,
    url: "/refunds",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: RawLegalSection[] = [
  {
    id: "relation",
    heading: "1. Relation to the Terms",
    content: [
      "This Refund Policy is part of the Terms of Service. It explains how we handle MarketLoopAI fees. It does not change platform advertising spend you incur on Meta, Google, TikTok, Snapchat, X, or other networks.",
    ],
  },
  {
    id: "subscriptions",
    heading: "2. Subscriptions",
    content: [
      "Paid plans are billed in advance through Stripe. Subscription fees are generally non-refundable for the current period except (a) where required by law, (b) a proven billing error, or (c) a refund we choose to grant as a courtesy.",
      "You may cancel renewal in the billing portal. Cancellation typically takes effect at the end of the current period unless law requires otherwise. We do not prorate unused days unless the product or a written order says so.",
    ],
  },
  {
    id: "credits",
    heading: "3. Credits and failed jobs",
    content: [
      "When you submit a billable generation or similar job, we may reserve credits, consume them if the job succeeds, and refund them as credits if the job fails for a Service fault (for example a GPU error or corrupted output) before a usable result is delivered.",
      "Credits are generally not refunded as cash. Credits are generally not restored if you cancel after processing has started and compute has been used, except where we state otherwise in the product or law requires it.",
      "Unused subscription grants may expire at period end. Purchased credit packs expire as stated at purchase. Credits have no cash value and are not transferable except within your organization.",
    ],
  },
  {
    id: "ad-spend",
    heading: "4. Third-party ad spend",
    content: [
      "You — not MarketLoopAI — are the advertiser of record. Advertising spend on connected platforms is charged by those platforms. We do not refund platform ad spend, rejected ads, or under-delivery on those networks.",
    ],
  },
  {
    id: "consumers-eu",
    heading: "5. Consumers in the EEA, UK, and similar markets",
    content: [
      "If you are a consumer (not acting for a trade) and consumer law in the EEA, UK, or a similar jurisdiction gives you a 14-day right of withdrawal for distance contracts, that right applies to the extent the law does not allow us to exclude it.",
      "For digital content or services, the cooling-off right may be lost if you expressly consent to performance beginning during the withdrawal period and acknowledge that you lose the right once performance starts. Generation jobs, downloaded outputs, and similar performance may have that effect.",
      "Business customers and organization accounts using the Service for marketing or advertising are not consumers. Mandatory consumer rights always prevail over this policy where they apply.",
    ],
  },
  {
    id: "other-regions",
    heading: "6. Other regions",
    content: [
      "Australian, Canadian, Brazilian, and other mandatory consumer-guarantee or unfair-contract rules apply where they cannot be excluded. Nothing in this policy limits a non-excludable statutory guarantee.",
    ],
  },
  {
    id: "how-to",
    heading: "7. How to request a refund",
    content: [
      "Use the billing portal where available, or email legal@marketloopai.com with the organization name, invoice ID, and reason. Chargebacks initiated without contacting us may result in suspension while we investigate.",
    ],
  },
  {
    id: "contact",
    heading: "8. Contact",
    content: [
      LEGAL_INDEX_SENTENCE,
    ],
  },
];

export default async function RefundsPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "refunds.pagehero.eyebrow", "Legal")}
      eyebrowKey="refunds.pagehero.eyebrow"
      title={getText(content, "refunds.pagehero.title", "Refund Policy")}
      titleKey="refunds.pagehero.title"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={buildLegalSections(content, "refunds", RAW_SECTIONS)}
    />
  );
}

import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { buildLegalSections, type RawLegalSection } from "@/lib/legal/build-sections";
import { LEGAL_INDEX_SENTENCE, LEGAL_LAST_UPDATED } from "@/lib/legal/constants";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const DESCRIPTION =
  "Infrastructure and AI compute providers that process MarketLoopAI Customer Content as subprocessors.";

export const metadata: Metadata = {
  title: "Subprocessors",
  description: DESCRIPTION,
  alternates: { canonical: "/subprocessors" },
  openGraph: {
    title: "Subprocessors",
    description: DESCRIPTION,
    url: "/subprocessors",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Subprocessors",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: RawLegalSection[] = [
  {
    id: "scope",
    heading: "1. Scope",
    content: [
      "This page lists subprocessors MarketLoopAI uses to process Customer Content and related personal data to provide the Service, as described in the Data Processing Addendum and Privacy Policy.",
      "Last reviewed " +
        LEGAL_LAST_UPDATED +
        ". Material additions will be posted here. Object under the DPA by emailing privacy@marketloopai.com.",
    ],
  },
  {
    id: "infrastructure",
    heading: "2. Infrastructure subprocessors",
    content: [
      {
        list: [
          "Vercel — hosting, edge delivery, and application runtime (typically United States and edge locations worldwide)",
          "Supabase — database, authentication, and object storage for accounts, Customer Content metadata, and media (region as configured for our project)",
          "Stripe — payment processing and billing (does not receive prompts or generated videos; receives billing identifiers and payment-method metadata)",
          "Resend (or a successor transactional-email provider) — transactional and product email",
        ],
      },
    ],
  },
  {
    id: "compute",
    heading: "3. Generation and compute",
    content: [
      "AI video and related generation jobs may run on GPU or cloud compute that we operate or that a cloud provider hosts. Workers receive the job payload (for example a prompt and optional reference file) and credentials sufficient to write the output. We may change regions or vendors for capacity, latency, or reliability.",
      "If we use a third-party model API as overflow or as an optional model, that provider is a subprocessor for the job payload. We will name material model APIs here or in an in-product notice before they process Customer Content.",
      "Self-hosted models such as Wan 2.2 (Apache 2.0) run on our workers; the model authors are not subprocessors of your prompts.",
    ],
  },
  {
    id: "monitoring",
    heading: "4. Operations monitoring",
    content: [
      "We may use error, logging, or product-analytics tools to operate and secure the Service. Those tools should receive the minimum operational data needed (for example error stacks and feature events), not your full media library.",
    ],
  },
  {
    id: "not-subprocessors",
    heading: "5. Parties that are not our subprocessors",
    content: [
      "Social and advertising platforms you connect (including Meta, Google, TikTok, Snapchat, X, and LinkedIn) receive content and campaign instructions you authorize. They are independent controllers of their platforms. Their terms and privacy policies apply.",
      "Google as an identity provider (\"Continue with Google\") is an independent controller of the Google account you use to sign in.",
      "Your organization's members, agencies, and clients who you invite are not our subprocessors.",
    ],
  },
  {
    id: "contact",
    heading: "6. Contact",
    content: [
      "Questions: privacy@marketloopai.com. " + LEGAL_INDEX_SENTENCE,
    ],
  },
];

export default async function SubprocessorsPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "subprocessors.pagehero.eyebrow", "Legal")}
      eyebrowKey="subprocessors.pagehero.eyebrow"
      title={getText(content, "subprocessors.pagehero.title", "Subprocessors")}
      titleKey="subprocessors.pagehero.title"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={buildLegalSections(content, "subprocessors", RAW_SECTIONS)}
    />
  );
}

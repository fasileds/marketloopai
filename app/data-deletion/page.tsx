import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { buildLegalSections, type RawLegalSection } from "@/lib/legal/build-sections";
import { LEGAL_INDEX_SENTENCE, LEGAL_LAST_UPDATED } from "@/lib/legal/constants";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const DESCRIPTION =
  "How to disconnect MarketLoopAI and request deletion of Facebook, Instagram, Google, TikTok, Snapchat, X, LinkedIn, and other platform data.";

export const metadata: Metadata = {
  title: "User Data Deletion",
  description: DESCRIPTION,
  alternates: { canonical: "/data-deletion" },
  openGraph: {
    title: "User Data Deletion",
    description: DESCRIPTION,
    url: "/data-deletion",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "User Data Deletion",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: RawLegalSection[] = [
  {
    id: "purpose",
    heading: "1. Purpose of this page",
    content: [
      "This page tells users — and Meta, Google, and other platform reviewers — how to delete data MarketLoopAI obtained through platform APIs (including Facebook Login, Instagram, Meta Marketing API, Google Sign-In, Google Ads API, TikTok, Snapchat, X, and LinkedIn).",
      "Meta App Dashboard field: use https://marketloopai.com/data-deletion as the User data deletion instructions URL. A data-deletion callback endpoint will be configured in the Meta app when the Facebook/Instagram integration is live; this page remains the human-readable instructions.",
    ],
  },
  {
    id: "disconnect",
    heading: "2. Disconnect a platform in MarketLoopAI",
    content: [
      "Signed-in organization admins can disconnect an integration in MarketLoopAI settings (connected accounts). Disconnecting revokes our use of that access token and stops new API calls. You should also revoke the app inside the platform:",
      {
        list: [
          "Meta / Facebook / Instagram: Facebook Settings > Apps and Websites (or Business Integrations), find MarketLoopAI, Remove",
          "Google: Google Account > Security > Third-party access, remove MarketLoopAI; for Google Ads, also remove access in Google Ads / Admin > Access and security if a manager token was used",
          "TikTok: TikTok account or TikTok Ads Manager authorized apps",
          "Snapchat: Snapchat Business Manager / authorized apps",
          "X: X Settings > Security and account access > Apps and sessions",
          "LinkedIn: LinkedIn Settings > Data privacy > Other applications",
        ],
      },
    ],
  },
  {
    id: "request",
    heading: "3. Request deletion from MarketLoopAI",
    content: [
      "Email privacy@marketloopai.com from the email on your MarketLoopAI account. Include: (1) the platform (for example Facebook, Instagram, Google Ads); (2) the Page, ad-account, or user ID if you have it; (3) whether you want only that connection deleted or the entire MarketLoopAI account/organization.",
      "We will verify that you control the account. We then delete or de-identify stored access tokens and platform data associated with that connection from production systems, typically within 30 days, except copies we must keep for law, security, or dispute resolution, and backups that expire on a rolling schedule.",
      "Organization-owned Customer Content (prompts, generated videos, campaign copies) is deleted through the organization owner as described in the Privacy Policy and DPA, unless you only asked to drop a platform connection.",
    ],
  },
  {
    id: "what-is-deleted",
    heading: "4. What we delete",
    content: [
      {
        list: [
          "OAuth access and refresh tokens for that platform",
          "Cached profile, Page, and ad-account lists pulled from the API",
          "Cached campaign structures and performance metrics stored for dashboards",
          "Publish logs that exist only in MarketLoopAI (not the live post on the platform)",
        ],
      },
    ],
  },
  {
    id: "what-is-not-deleted",
    heading: "5. What we cannot delete here",
    content: [
      "Posts, ads, and audiences that already exist on Facebook, Instagram, Google Ads, TikTok, Snapchat, X, or LinkedIn remain on those platforms until you delete them there (or use a delete action in MarketLoopAI that the API supports). Platform billing records stay with the platform. Other members of your MarketLoopAI organization may still have copies in the workspace until the owner deletes the project.",
    ],
  },
  {
    id: "meta-callback",
    heading: "6. Meta data-deletion callback",
    content: [
      "When the Meta app is live, Facebook may send a signed deletion request if a user removes MarketLoopAI from Facebook. We will process that callback by deleting Facebook and Instagram user data and tokens we stored for that user ID, and we will respond with a confirmation code as Meta's developer documentation requires.",
    ],
  },
  {
    id: "google",
    heading: "7. Google user data",
    content: [
      "Deleting your MarketLoopAI account or emailing privacy@marketloopai.com also covers Google Sign-In identifiers and Google Ads data we stored. See marketloopai.com/google-api. You should also revoke access in your Google Account.",
    ],
  },
  {
    id: "contact",
    heading: "8. Contact",
    content: [
      "privacy@marketloopai.com. " + LEGAL_INDEX_SENTENCE,
    ],
  },
];

export default async function DataDeletionPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "deletion.pagehero.eyebrow", "Legal")}
      eyebrowKey="deletion.pagehero.eyebrow"
      title={getText(content, "deletion.pagehero.title", "User Data Deletion")}
      titleKey="deletion.pagehero.title"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={buildLegalSections(content, "deletion", RAW_SECTIONS)}
    />
  );
}

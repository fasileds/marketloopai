import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { buildLegalSections, type RawLegalSection } from "@/lib/legal/build-sections";
import { LEGAL_INDEX_SENTENCE, LEGAL_LAST_UPDATED } from "@/lib/legal/constants";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const DESCRIPTION =
  "How MarketLoopAI uses Google Sign-In and Google Ads API data, including Google API Services User Data Policy and Limited Use commitments.";

export const metadata: Metadata = {
  title: "Google API User Data Disclosure",
  description: DESCRIPTION,
  alternates: { canonical: "/google-api" },
  openGraph: {
    title: "Google API User Data Disclosure",
    description: DESCRIPTION,
    url: "/google-api",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Google API User Data Disclosure",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: RawLegalSection[] = [
  {
    id: "purpose",
    heading: "1. Purpose",
    content: [
      "This disclosure is for Google OAuth verification, Google Ads API access, and users of MarketLoopAI. It supplements the Privacy Policy and the Platform Integrations Policy. Google's OAuth consent screen should list https://marketloopai.com/privacy and may link this page.",
      "MarketLoopAI's use of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.",
    ],
  },
  {
    id: "sign-in",
    heading: "2. Google Sign-In",
    content: [
      "If you choose \"Continue with Google\", we request basic profile scopes (typically email, name, and profile image). We use them only to create and authenticate your MarketLoopAI account. We do not read Gmail, Drive, Calendar, Contacts, or YouTube unless this page is updated and you grant those scopes in a new consent screen — we do not currently request those scopes.",
    ],
  },
  {
    id: "ads-api",
    heading: "3. Google Ads API",
    content: [
      "When you connect Google Ads, we access the Google Ads API with the permissions you approve (for example to read and mutate campaigns for accounts you administer). Data may include customer IDs, account names, campaigns, ad groups, ads, assets, budgets, bids, targeting, status, and performance metrics.",
      "We use this data only to provide user-facing campaign management, reporting, and performance suggestions inside MarketLoopAI for that customer's accounts. We do not use Google Ads data to run MarketLoopAI's own ads, to build remarketing lists for other customers, or to train public foundation models.",
    ],
  },
  {
    id: "limited-use",
    heading: "4. Limited Use",
    content: [
      "MarketLoopAI complies with Google's Limited Use rules for Google user data (including data received from Sign-In and, as applicable, other Google APIs):",
      {
        list: [
          "We use Google user data only to provide or improve user-facing features that are prominent in MarketLoopAI",
          "We do not transfer Google user data to others except (a) as necessary to provide or improve those features (for example our hosting/database processors), (b) to comply with law, or (c) as part of a merger, acquisition, or sale of assets with notice where required",
          "We do not use Google user data for serving advertisements, including retargeting, personalized ads, or advertising measurement, other than showing the user their own Google Ads performance inside the product",
          "We do not allow humans to read Google user data unless we have the user's affirmative consent for specific messages, doing so is necessary for security or compliance, or the data is aggregated and not identifiable",
        ],
      },
    ],
  },
  {
    id: "storage-sharing",
    heading: "5. Storage, sharing, and processors",
    content: [
      "Google user data is stored with our infrastructure processors (see marketloopai.com/subprocessors), encrypted in transit, and protected as described on the Security page. Organization admins can see connected Google Ads data in the workspace. We do not sell Google user data.",
    ],
  },
  {
    id: "deletion",
    heading: "6. Access, revocation, and deletion",
    content: [
      "You can disconnect Google Ads in MarketLoopAI and revoke MarketLoopAI in your Google Account (Security > Third-party access). To delete stored Google data, follow marketloopai.com/data-deletion or email privacy@marketloopai.com.",
    ],
  },
  {
    id: "contact",
    heading: "7. Contact",
    content: [
      "privacy@marketloopai.com. " + LEGAL_INDEX_SENTENCE,
    ],
  },
];

export default async function GoogleApiPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "googleapi.pagehero.eyebrow", "Legal")}
      eyebrowKey="googleapi.pagehero.eyebrow"
      title={getText(content, "googleapi.pagehero.title", "Google API User Data Disclosure")}
      titleKey="googleapi.pagehero.title"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={buildLegalSections(content, "googleapi", RAW_SECTIONS)}
    />
  );
}

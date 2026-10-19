import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { buildLegalSections, type RawLegalSection } from "@/lib/legal/build-sections";
import { LEGAL_INDEX_SENTENCE, LEGAL_LAST_UPDATED } from "@/lib/legal/constants";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const DESCRIPTION =
  "How MarketLoopAI connects to Meta, Google, TikTok, Snapchat, X, and LinkedIn APIs: data we access, how we use it, and the platform developer terms we follow.";

export const metadata: Metadata = {
  title: "Platform Integrations Policy",
  description: DESCRIPTION,
  alternates: { canonical: "/platform-integrations" },
  openGraph: {
    title: "Platform Integrations Policy",
    description: DESCRIPTION,
    url: "/platform-integrations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Platform Integrations Policy",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: RawLegalSection[] = [
  {
    id: "reviewer-urls",
    heading: "1. URLs for platform app review",
    content: [
      "MarketLoopAI integrates by official APIs (OAuth and ads/marketing APIs) with the platforms listed below. Platform reviewers should use these public URLs:",
      {
        list: [
          "Privacy Policy: https://marketloopai.com/privacy",
          "Terms of Service: https://marketloopai.com/terms",
          "Acceptable Use Policy: https://marketloopai.com/acceptable-use",
          "This Platform Integrations Policy: https://marketloopai.com/platform-integrations",
          "User data deletion instructions (required for Meta): https://marketloopai.com/data-deletion",
          "Google API Services user-data disclosure and Limited Use: https://marketloopai.com/google-api",
          "Cookie Policy: https://marketloopai.com/cookies",
          "Data Processing Addendum: https://marketloopai.com/dpa",
        ],
      },
      "This policy is part of the Terms of Service. It applies when a user or organization connects a platform account to MarketLoopAI.",
    ],
  },
  {
    id: "what-we-build",
    heading: "2. What the integrations do",
    content: [
      "Users authorize MarketLoopAI to: (a) publish or schedule marketing content they approve to connected pages, profiles, or accounts; (b) create, update, pause, and read ad campaigns, ad sets/ad groups, ads, creative, budgets, and targeting they instruct; and (c) read delivery and performance metrics to show dashboards and to suggest creative based on what is already performing.",
      "We access only the scopes the user approves in the platform's OAuth or business-login consent screen. We do not scrape logged-out public pages as a substitute for the API. We do not request permissions we do not need for a user-facing feature.",
    ],
  },
  {
    id: "common-rules",
    heading: "3. Rules that apply to every platform",
    content: [
      {
        list: [
          "The user (or their organization) must have the right to connect the account, page, ad account, or catalog. Agencies must have client authority.",
          "The user must comply with that platform's terms, community guidelines, advertising policies, and API/developer terms. Those terms bind the user directly. If they conflict with MarketLoopAI features, the platform's terms control for activity on that platform.",
          "MarketLoopAI is not the advertiser of record. Ad spend is billed by the platform to the connected ad account.",
          "Access tokens are stored server-side, encrypted at rest by our infrastructure, and used only to provide the Service. Tokens are not sold.",
          "We do not sell, rent, or license platform user or ads data. We do not use platform data to build independent identity graphs or to advertise MarketLoopAI to other people using that data.",
          "We do not transfer data obtained from one advertising platform to another advertising platform to target people, except where the user explicitly instructs a permitted workflow and the source platform allows it.",
          "Disconnecting the app in MarketLoopAI or in the platform's settings stops new API calls. Stored tokens are revoked or deleted. Cached metrics and copies in the user's workspace are deleted on request or as described at marketloopai.com/data-deletion. Content already published on the platform is not un-posted unless the user uses a delete action we expose and the platform API supports it.",
          "If a platform requires deletion after a user uninstalls the app, we honor that request (including Meta's data-deletion callback when configured).",
        ],
      },
    ],
  },
  {
    id: "meta",
    heading: "4. Meta: Facebook, Instagram, and Meta Ads",
    content: [
      "Products: Facebook Login (and Meta Business Login / Facebook Login for Business as offered), Instagram Graph API, Pages API, and Meta Marketing API (Facebook/Instagram ads). We do not currently offer WhatsApp Business API unless listed here in a later update.",
      "Data we may receive, depending on approved permissions: Facebook/Instagram user ID, name, email, profile photo; list of Pages and Instagram professional accounts the user manages; Page and Instagram content we publish and publish receipts; ad-account IDs and names; campaign, ad-set, and ad structure; creative assets the user uploads or we send; budgets and targeting the user sets; and performance metrics (impressions, clicks, spend, results, and similar fields).",
      "How we use Meta data: to authenticate the user; to let them choose a Page, Instagram account, or ad account; to publish or schedule content they approve; to create and manage ads they instruct; and to display and analyze performance in MarketLoopAI. We do not use Meta data to train public foundation models. We do not sell Meta data. We do not use Marketing API data to retarget people on third-party networks except as the user instructs in a feature Meta's terms allow.",
      "We comply with Meta Platform Terms, Developer Policies, Business Tools Terms, and Marketing API Terms (including data-use restrictions). Custom Audiences, if offered, will be used only as Meta's Custom Audiences terms allow. Users can remove MarketLoopAI from Facebook Settings > Apps and Websites. Deletion instructions: marketloopai.com/data-deletion.",
    ],
  },
  {
    id: "google",
    heading: "5. Google: Sign-In and Google Ads API",
    content: [
      "Products: Google Sign-In / Google Identity (OAuth) for MarketLoopAI accounts, and Google Ads API for campaign management. We do not request Gmail, Drive, Calendar, or other unrelated restricted scopes.",
      "Google Sign-In data: email address, name, and profile image if the user grants those scopes, used only to create and authenticate the MarketLoopAI account.",
      "Google Ads API data, depending on approved access: Google Ads customer IDs, account names, campaign/ad-group/ad structure, budgets, bids, targeting, assets, and performance metrics the API returns. Used only to manage and report on that customer's Google Ads account inside MarketLoopAI.",
      "Google user data is used solely to provide and improve user-facing MarketLoopAI features the user can interact with. We do not sell Google user data. We do not use Google user data to serve advertisements to other users. We do not allow humans to read Google user data except with the user's consent, for security/compliance, or in aggregated/de-identified form. Full Limited Use statement: marketloopai.com/google-api. We comply with the Google API Services User Data Policy, Google Ads API Terms of Service, and Google APIs Terms of Service.",
    ],
  },
  {
    id: "tiktok",
    heading: "6. TikTok and TikTok Ads",
    content: [
      "Products: TikTok content publishing APIs (for example Content Posting / Login Kit as offered) and TikTok Marketing API / Ads API.",
      "Data we may receive: TikTok user or advertiser identifiers, display name, authorized account list, video or post metadata for content the user publishes through us, ad-account structure, creative, targeting and budget the user sets, and delivery metrics.",
      "Use: publish approved content, manage TikTok ads the user instructs, and show performance. We do not sell TikTok data, scrape TikTok outside the API, or use TikTok data to build profiles for unrelated products. We comply with the TikTok Developer Terms of Service, TikTok API Terms, and TikTok Advertising Policies. Users can revoke access in TikTok account permissions and in MarketLoopAI.",
    ],
  },
  {
    id: "snapchat",
    heading: "7. Snapchat and Snapchat Ads",
    content: [
      "Products: Snapchat marketing / ads APIs and any official posting APIs we enable (for example Snap Kit or Marketing API as offered).",
      "Data we may receive: Snap organization or ad-account identifiers, account names, campaign and ad structure, creative the user provides, targeting and budget, and performance metrics; and, if posting is enabled, profile identifiers and publish receipts.",
      "Use: publish approved Snaps/content where enabled, manage Snapchat Ads, and report performance. We do not sell Snap data or use it for unrelated advertising. We comply with Snap Developer Terms, Marketing API terms, and Snap Advertising Policies. Users may revoke access in Snapchat Business Manager or equivalent settings and in MarketLoopAI.",
    ],
  },
  {
    id: "x",
    heading: "8. X (Twitter) and X Ads",
    content: [
      "Products: X API for posting (and related user authentication) and X Ads API.",
      "Data we may receive: X user ID, handle, display name, authorized ad-account IDs, posts we publish and IDs/receipts, campaign and ad structure, targeting and budget, and performance metrics.",
      "Use: publish approved posts, manage X Ads, and report performance. We do not sell X content or ads data, exceed rate limits, or use the API to scrape or surveil people. We comply with the X Developer Agreement and Policy, Ads API terms, and display requirements. Users can revoke MarketLoopAI in X Settings > Security and account access (or Connected apps) and in MarketLoopAI.",
    ],
  },
  {
    id: "linkedin",
    heading: "9. LinkedIn",
    content: [
      "Products: LinkedIn Marketing Developer Platform / Community Management and Ads APIs as offered (organization pages, organic posts, and LinkedIn Ads).",
      "Data we may receive: member or app user identifiers needed for OAuth, organization/page identifiers the user administers, post content the user publishes through us, ad-account and campaign structure, creative, targeting and budget, and performance metrics. We request only the LinkedIn products and permissions required for those features (for example organization posting and ads, not unrelated member profile mining).",
      "Use: publish approved Page or organization content, manage LinkedIn Ads, and report performance. We do not sell LinkedIn data, store LinkedIn member data longer than needed to provide the Service, or use it to build a data broker product. We comply with the LinkedIn API Terms of Use, Marketing Developer Platform terms, and LinkedIn Advertising Policies. Users can revoke access in LinkedIn Settings > Data privacy > Other applications and in MarketLoopAI.",
    ],
  },
  {
    id: "sharing",
    heading: "10. Sharing of platform data",
    content: [
      "We share platform data with: (a) the user's organization members who have access to the workspace; (b) infrastructure processors listed at marketloopai.com/subprocessors (hosting, database, storage) solely to provide the Service; (c) the same platform, when we call its API; and (d) authorities if required by law.",
      "We do not share one platform's user or ads data with a competing ads platform except as the user explicitly instructs in a feature both platforms allow. We do not sell platform data.",
    ],
  },
  {
    id: "retention",
    heading: "11. Retention",
    content: [
      "OAuth tokens are kept until the user disconnects, the token expires or is revoked, or the MarketLoopAI account/organization is deleted. Campaign snapshots, publish logs, and metrics in the product are kept while the workspace is active and then as described in the Privacy Policy. We do not keep platform data for independent advertising after the connection ends.",
    ],
  },
  {
    id: "changes-to-scopes",
    heading: "12. New scopes or new uses",
    content: [
      "If we need new API scopes or a materially new use of platform data, we will update this policy and the Privacy Policy and obtain a new user consent through the platform's authorization flow (and in-product notice where required) before that new use.",
    ],
  },
  {
    id: "contact",
    heading: "13. Contact",
    content: [
      "Platform and privacy questions: privacy@marketloopai.com. Legal: legal@marketloopai.com. Security: security@marketloopai.com. " +
        LEGAL_INDEX_SENTENCE,
    ],
  },
];

export default async function PlatformIntegrationsPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "platform.pagehero.eyebrow", "Legal")}
      eyebrowKey="platform.pagehero.eyebrow"
      title={getText(content, "platform.pagehero.title", "Platform Integrations Policy")}
      titleKey="platform.pagehero.title"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={buildLegalSections(content, "platform", RAW_SECTIONS)}
    />
  );
}

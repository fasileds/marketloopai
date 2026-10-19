import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { getSiteContent, getText } from "@/lib/content/get-site-content";
import { buildLegalSections, type RawLegalSection } from "@/lib/legal/build-sections";
import { LEGAL_INDEX_SENTENCE, LEGAL_LAST_UPDATED } from "@/lib/legal/constants";

const DESCRIPTION =
  "Terms of Service for the MarketLoopAI SaaS platform, including AI content and video generation, campaign management, and platform integrations.";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service",
    description: DESCRIPTION,
    url: "/terms",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: RawLegalSection[] = [
  {
    id: "agreement",
    heading: "1. The agreement",
    content: [
      "These Terms of Service (the \"Terms\") are a legally binding agreement between you and MarketLoopAI (\"MarketLoopAI\", \"we\", \"us\", or \"our\"). They govern your access to and use of marketloopai.com, our web application, APIs, waitlist, documentation, and all related products and services (together, the \"Service\").",
      "The Service is a software-as-a-service platform for marketing teams. It includes, without limitation: AI content generation, humanization, ranking, and repurposing; AI video generation and storyboards; publishing to connected social platforms; multi-platform ad campaign management; performance analytics; and suggestions based on campaign and content results.",
      "By creating an account, joining an organization, joining the waitlist, clicking to accept these Terms, or otherwise using the Service, you agree to these Terms and to the policies incorporated by reference: Acceptable Use Policy, Privacy Policy, Cookie Policy, AI Policy, Refund Policy, Referral Program Terms, Copyright and DMCA Policy, Platform Integrations Policy, User Data Deletion instructions, Google API User Data Disclosure, and — when we process Customer Content personal data for your organization — the Data Processing Addendum. The current versions are listed at marketloopai.com/legal. If you do not agree, do not use the Service.",
      "If you use the Service on behalf of a company or other entity, you represent that you have authority to bind that entity, and \"you\" includes that entity. The entity is responsible for all users it invites.",
    ],
  },
  {
    id: "eligibility",
    heading: "2. Eligibility",
    content: [
      "You must be at least 18 years old, or the age of majority in your jurisdiction if higher, to create an account or use paid, generation, publishing, or advertising features. The public marketing website may be viewed by visitors 16 or older.",
      "You must have the legal capacity to enter a contract. You may not use the Service if you are barred from doing so under applicable law, including export and sanctions rules.",
      "Advertising features also require that you meet the eligibility rules of each connected platform (for example, Meta, Google, TikTok, Snapchat, and X). Those platforms typically require a valid business presence and compliance with their advertising policies.",
    ],
  },
  {
    id: "accounts-organizations",
    heading: "3. Accounts, organizations, and seats",
    content: [
      "You may create an account using email (including a magic link) or a supported identity provider such as Google. You must provide accurate information and keep it current. You are responsible for activity under your account and for keeping credentials confidential.",
      "The Service is organized around organizations (workspaces). An organization owner may invite members and assign roles (for example owner, admin, member, or viewer). The owner is responsible for users in the organization, for billing, and for content they generate or publish.",
      "You must promptly revoke access for people who should no longer use the organization (for example former employees or contractors). You must not share login credentials.",
      "We may refuse, suspend, or reclaim usernames, organization slugs, or accounts that violate these Terms or that we reasonably believe are fraudulent or abusive.",
    ],
  },
  {
    id: "waitlist",
    heading: "4. Waitlist and early access",
    content: [
      "Joining the waitlist does not guarantee access, a launch date, pricing, or a specific feature set. Referral ranking and rewards are discretionary and may change. The Referral Program Terms at marketloopai.com/referral-terms apply.",
      "Early access, beta, or design-partner features may be incomplete, rate-limited, or withdrawn. Feedback you provide may be used to improve the Service. Feedback is not confidential unless we agree otherwise in writing, and you grant us a license to use it without obligation to you.",
    ],
  },
  {
    id: "subscriptions-credits",
    heading: "5. Subscriptions, credits, and usage limits",
    content: [
      "Paid access is sold as subscriptions and, where applicable, credit packs or usage allowances. Plan descriptions on the Pricing page (including content generations, AI videos, images, ad generations, seats, and workspaces) describe intended commercial entitlements and may be implemented as credits so more expensive jobs (for example higher-resolution video) consume more of the allowance.",
      "When you submit a generation or other billable job, we may reserve credits or quota at submit time, consume them if the job succeeds, and refund them if the job fails for reasons on our side (for example a GPU error or a corrupted output) before a usable result is delivered. Credits are generally not refunded for jobs you cancel after processing has started if compute has already been used, except where we state otherwise in the product.",
      "Unused subscription grants may expire at the end of the billing period. Purchased credit packs, if offered, expire as stated at purchase. Credits have no cash value, are not transferable except within your organization, and may not be sold.",
      "We may enforce concurrent-job limits, rate limits, storage limits, and fair-use caps so that one customer cannot unreasonably consume shared generation or publishing capacity. Exceeding limits may queue, throttle, or reject jobs.",
    ],
  },
  {
    id: "billing",
    heading: "6. Billing and taxes",
    content: [
      "Paid plans are billed in advance on a recurring basis through our payment processor (currently Stripe). You authorize us and the processor to charge your payment method for the selected plan, taxes, and any usage or overage we disclose before charging.",
      "We do not store full card numbers on our servers. Billing details, invoices, and cancellations are managed through the account billing portal where available.",
      "Fees are exclusive of taxes unless stated. You are responsible for applicable VAT, sales tax, or similar charges. Price changes take effect on the next renewal after notice, except where law requires otherwise.",
      "If payment fails, we may retry, suspend generation, publishing, or advertising features, or downgrade the organization until payment is restored. You remain responsible for amounts due.",
    ],
  },
  {
    id: "refunds",
    heading: "7. Refunds",
    content: [
      "Subscription fees are generally non-refundable except where required by law or where we choose to refund at our discretion (for example a billing error). Details, including EEA/UK consumer cooling-off where it applies, are in the Refund Policy at marketloopai.com/refunds.",
      "Failed generations that do not produce a usable output due to a Service fault are refunded as credits or quota, not typically as cash, unless required by law.",
      "Advertising spend you incur on Meta, Google, TikTok, Snapchat, X, or other platforms is charged by those platforms, not by MarketLoopAI. We do not refund platform ad spend.",
    ],
  },
  {
    id: "customer-content",
    heading: "8. Your content",
    content: [
      "\"Customer Content\" means everything you or your users submit, upload, connect, or generate through the Service, including prompts, negative prompts, product descriptions, brand assets, images, audio, reference files, generated videos and images, storyboards, captions, campaign settings, and performance data pulled from connected accounts.",
      "As between you and MarketLoopAI, you retain ownership of Customer Content, including outputs we generate for you, subject to third-party model licenses, platform terms, and the rights of others. You are responsible for having the rights to all inputs (including likenesses, trademarks, music, and stock you do not own).",
      "You grant MarketLoopAI a worldwide, non-exclusive license to host, process, transmit, display, and generate derivatives of Customer Content solely to provide, secure, troubleshoot, and improve the Service for you (for example encoding a video, creating a poster frame, or producing a performance suggestion). We do not use Customer Content to train public foundation models unless you opt in to a separate, clearly disclosed program.",
      "You represent that Customer Content and your use of outputs will not infringe others' rights or violate law or these Terms.",
    ],
  },
  {
    id: "ai-outputs",
    heading: "9. AI-generated output",
    content: [
      "The Service uses artificial intelligence, including self-hosted open-source video models (such as Wan 2.2, licensed under Apache 2.0) and other models or providers we may add. Outputs are probabilistic. The same prompt can produce different results. We do not warrant that outputs are unique, accurate, brand-safe, non-infringing, or fit for a particular campaign. The AI Policy at marketloopai.com/ai describes roles under the EU AI Act, labeling, and training limits.",
      "You must review all outputs before you publish, advertise, or otherwise rely on them. You are solely responsible for captions, claims, disclosures, music, faces, logos, and compliance with advertising and consumer-protection law.",
      "Model authors typically claim no rights in generated media and require lawful use. You remain accountable for how you use outputs, including not using them to harm people, spread unlawful content, or violate platform rules.",
      "We may moderate prompts, uploads, and outputs, block jobs, or remove content that appears to violate these Terms. Moderation is not a guarantee that remaining content is lawful or appropriate.",
    ],
  },
  {
    id: "video-generation",
    heading: "10. Video generation",
    content: [
      "Video jobs run asynchronously on dedicated compute. Generation can take several minutes. Native clip length, resolution, and frame rate depend on the selected model and settings (for example, Wan 2.2 typically produces short clips on the order of about five seconds). Longer ads, if offered, may be assembled from multiple shots or storyboards rather than a single native generation.",
      "You may cancel a queued job. Cancellation after a worker has started may not stop GPU work immediately. Timeouts, out-of-memory errors, and infrastructure failures can cause jobs to fail; failed jobs are handled under the credits rules above.",
      "Do not upload malware, or images or audio you are not allowed to use. We may re-encode uploads, strip metadata, and reject files that fail security or size checks.",
      "You must not use the video features to create non-consensual intimate imagery, child sexual abuse material (which we will report), realistic deceptive depictions of real people used to defraud or harass, or other illegal media.",
    ],
  },
  {
    id: "publishing-integrations",
    heading: "11. Publishing and social integrations",
    content: [
      "If you connect social accounts (including LinkedIn, TikTok, Snapchat, X, Facebook, and Instagram), you authorize us to access those accounts within the permissions you grant, to publish or schedule content you approve, and to retrieve status needed to operate the feature.",
      "You must comply with each platform's terms, community guidelines, advertising policies, and developer/API terms (including Meta Platform Terms and Marketing API Terms; Google API Services User Data Policy and Google Ads API Terms; TikTok Developer Terms; Snap Developer Terms; X Developer Agreement and Policy; and LinkedIn API Terms of Use). Those platform terms bind you for activity on that platform. Platforms may change, rate-limit, or revoke access at any time. We are not responsible for platform outages, account bans, reduced reach, or content takedowns by those platforms.",
      "You represent that you have authority to connect every Page, profile, catalog, and ad account you authorize. You can disconnect an integration in the product or via the platform. Disconnecting may stop publishing but does not delete historical content already posted on the platform. Details, scopes, and app-review URLs are in the Platform Integrations Policy at marketloopai.com/platform-integrations. Deletion: marketloopai.com/data-deletion.",
    ],
  },
  {
    id: "advertising",
    heading: "12. Ad campaign management",
    content: [
      "If you connect ad accounts (including TikTok Ads, Snapchat Ads, X Ads, Google Ads, and Facebook/Meta Ads), you authorize us to create, update, pause, and manage campaigns, ad sets, ads, and related creative you instruct us to handle, and to read delivery and performance metrics.",
      "You — not MarketLoopAI — are the advertiser of record. You are responsible for ad spend, billing on those platforms, targeting, landing pages, required disclosures, restricted-product rules, and political or special-category advertising where applicable.",
      "We do not guarantee delivery, cost-per-result, approval by platform review teams, or campaign outcomes. Platform review may reject creative we help you generate or publish.",
      "OAuth tokens and credentials are stored to operate the integration. You must use least-privilege access where the platform allows it and revoke access when a user leaves your organization.",
    ],
  },
  {
    id: "analytics-suggestions",
    heading: "13. Analytics and performance suggestions",
    content: [
      "The Service may ingest performance data from connected social and ad accounts (such as impressions, clicks, spend, conversions, engagement, and similar metrics the platform exposes) to show dashboards and to rank or suggest creative, copy, audiences, or next actions.",
      "Suggestions are automated opinions based on incomplete data. They are not financial, legal, or professional advertising advice. You remain responsible for the campaigns you run and the budget you approve.",
      "Metrics can lag, be sampled, or differ from the platform's own UI. We do not warrant parity with every platform report.",
    ],
  },
  {
    id: "acceptable-use",
    heading: "14. Acceptable use",
    content: [
      "You agree to use the Service only for lawful business and personal marketing purposes, and not to:",
      {
        list: [
          "Violate any law, regulation, or third-party right, including privacy, publicity, trademark, and copyright",
          "Generate, upload, or distribute child sexual abuse material, or exploit minors in any way",
          "Create or run scams, phishing, malware, or deceptive ads",
          "Impersonate a person or brand, or produce non-consensual intimate or sexually explicit media",
          "Interfere with the Service, probe it except through an authorized security program, scrape at scale, or bypass rate limits or credits",
          "Resell the Service or generated capacity without our written permission, except as an agency using workspaces for named clients under your own agreement with them",
          "Misuse referral, waitlist, trial, or credit systems (including fake accounts)",
          "Use the Service to train competing models in a way that copies our software or systematically extracts model weights",
        ],
      },
      "A more detailed Acceptable Use Policy is published at marketloopai.com/acceptable-use and is incorporated into these Terms. We may investigate, remove content, suspend jobs, disconnect integrations, or terminate accounts for violations. We may report illegal activity to authorities and platforms.",
    ],
  },
  {
    id: "intellectual-property",
    heading: "15. Our intellectual property",
    content: [
      "The Service, including our software, models we host as configured by us, branding, design, documentation, and ranking or suggestion logic, is owned by MarketLoopAI or its licensors. These Terms do not transfer those rights to you. Open-source components (including Wan 2.2) remain under their own licenses, including Apache 2.0 where applicable.",
      "You may not copy, reverse engineer, or create derivative works of the Service except as allowed by mandatory law or an open-source license that applies to a specific component. Copyright complaints follow the Copyright and DMCA Policy at marketloopai.com/copyright.",
    ],
  },
  {
    id: "confidentiality-security",
    heading: "16. Confidentiality and security",
    content: [
      "Each party may receive confidential information from the other. You will not disclose our non-public product, pricing, or security information. We will not disclose your Customer Content except to provide the Service, as required by law, or with your instruction (including publishing you approve).",
      "You must use reasonable security for your accounts and connected ad credentials. Notify us promptly of unauthorized access at security@marketloopai.com.",
      "No system is perfectly secure. You use the Service understanding that generation infrastructure, third-party platforms, and the internet carry residual risk.",
    ],
  },
  {
    id: "availability",
    heading: "17. Availability, changes, and support",
    content: [
      "We aim for a reliable Service but do not guarantee uninterrupted or error-free operation. Generation depends on GPU capacity and may be queued or temporarily unavailable. Publishing and ads depend on third-party APIs.",
      "We may modify, add, or remove features, models, resolutions, or integrations. If we discontinue a material paid feature, we will provide reasonable notice where practicable.",
      "Support channels and response times depend on your plan. We do not provide 24/7 guaranteed support unless a separate agreement says so.",
    ],
  },
  {
    id: "suspension-termination",
    heading: "18. Suspension and termination",
    content: [
      "You may stop using the Service and request account or organization deletion at any time. Deletion of generated files, campaign history, and backups may take a reasonable period and may be limited where we must retain records.",
      "We may suspend or terminate access immediately if we reasonably believe you have violated these Terms, if payment fails, if required by law, or if continuing would create legal, security, or operational risk.",
      "Upon termination, your license to use the Service ends. Provisions that should survive (including ownership, AI-output responsibility, fees owed, disclaimers, liability limits, and indemnity) survive.",
    ],
  },
  {
    id: "disclaimers",
    heading: "19. Disclaimers",
    content: [
      "THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\". TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.",
      "We do not warrant specific generation quality, latency, ranking accuracy, advertising performance, or that outputs will be approved by social or ad platforms.",
    ],
  },
  {
    id: "liability",
    heading: "20. Limitation of liability",
    content: [
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, MARKETLOOPAI WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, DATA, OR GOODWILL, EVEN IF ADVISED OF THE POSSIBILITY.",
      "OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING OUT OF THE SERVICE IN ANY TWELVE-MONTH PERIOD WILL NOT EXCEED THE AMOUNTS YOU PAID US FOR THE SERVICE IN THAT PERIOD (OR, IF YOU PAID NOTHING, FIFTY U.S. DOLLARS). THESE LIMITS DO NOT APPLY TO LIABILITY THAT CANNOT BE LIMITED UNDER LAW.",
      "Ad spend on third-party platforms is not \"amounts you paid us\". We are not liable for that spend.",
    ],
  },
  {
    id: "indemnity",
    heading: "21. Indemnification",
    content: [
      "You will defend, indemnify, and hold harmless MarketLoopAI and our personnel from claims, damages, and costs (including reasonable legal fees) arising from Customer Content, your campaigns and ad spend, your outputs, your connected accounts, or your violation of these Terms or of platform or advertising rules.",
    ],
  },
  {
    id: "law",
    heading: "22. Governing law",
    content: [
      "These Terms are governed by the laws of the jurisdiction in which MarketLoopAI is organized, excluding conflict-of-law rules, except where consumer or mandatory local law requires otherwise. Courts in that jurisdiction have exclusive jurisdiction, except that we may seek injunctive relief anywhere.",
    ],
  },
  {
    id: "changes",
    heading: "23. Changes to these Terms",
    content: [
      "We may update these Terms. We will change the \"Last updated\" date and, for material changes, provide additional notice (for example email or an in-app banner) where appropriate. Continued use after the effective date constitutes acceptance. If you do not agree, stop using the Service and cancel your subscription.",
    ],
  },
  {
    id: "agencies",
    heading: "24. Agencies and resale",
    content: [
      "If you are an agency, you may use workspaces for named clients under your own contract with them. You remain our customer. You must have authority to connect each client's ad and social accounts. You may not white-label or resell the Service as your own product without a written partner agreement.",
    ],
  },
  {
    id: "export-sanctions",
    heading: "25. Export controls and sanctions",
    content: [
      "You may not use the Service if you are located in, or are a person sanctioned by, a country or list administered by the United States, the United Kingdom, the European Union, the United Nations, or other applicable authorities, or if your use would violate export, dual-use, or sanctions rules. Generation infrastructure and models may be subject to additional export limits.",
    ],
  },
  {
    id: "force-majeure",
    heading: "26. Force majeure",
    content: [
      "Neither party is liable for delay or failure caused by events beyond reasonable control, including outages of cloud or GPU providers, connected social or ads platforms, utilities, labor disputes, war, epidemic, or changes in law, provided the affected party uses reasonable efforts to mitigate.",
    ],
  },
  {
    id: "disputes",
    heading: "27. Disputes",
    content: [
      "Before filing a claim, the parties will try in good faith to resolve the dispute by emailing legal@marketloopai.com (allow 30 days except for injunctive relief or IP claims).",
      "Mandatory consumer, employment, and data-protection rights in the EEA, UK, and other jurisdictions remain available. Nothing in these Terms requires an EEA or UK consumer to arbitrate or to sue only in a distant court where that would be unfair under local law.",
      "For organization (B2B) customers, exclusive jurisdiction is as stated in the governing-law section, except that we may seek injunctive relief in any forum to protect the Service, users, or IP.",
    ],
  },
  {
    id: "general",
    heading: "28. General",
    content: [
      "These Terms, the incorporated policies listed above, and any order form or signed DPA are the entire agreement and supersede prior discussions on the same subject. Order of precedence: a signed order or DPA (on its subject), then these Terms, then the other policies (the Acceptable Use Policy controls on prohibited uses).",
      "If a provision is unenforceable, the rest remains in effect. Failure to enforce is not a waiver. You may not assign the Agreement without our consent, except to a successor of substantially all of your business; we may assign to an affiliate or in a merger or sale of assets.",
      "Headings are for convenience only. \"Including\" means \"including without limitation.\" Notices to you may be sent to the email on your account or posted in the Service. Notices to us must be sent to legal@marketloopai.com.",
      "You consent to electronic communications and electronic signatures for the Service, invoices, and policy updates, to the extent permitted by law (including ESIGN/UETA in the United States and eIDAS in the EU).",
    ],
  },
  {
    id: "contact",
    heading: "29. Contact",
    content: [
      "Legal questions: legal@marketloopai.com. Privacy: privacy@marketloopai.com. Security: security@marketloopai.com. General: the contact form on marketloopai.com. " +
        LEGAL_INDEX_SENTENCE,
    ],
  },
];

export default async function TermsPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "terms.pagehero.eyebrow", "Legal")}
      eyebrowKey="terms.pagehero.eyebrow"
      title={getText(content, "terms.pagehero.title", "Terms of Service")}
      titleKey="terms.pagehero.title"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={buildLegalSections(content, "terms", RAW_SECTIONS)}
    />
  );
}

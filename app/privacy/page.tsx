import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { getSiteContent, getText, type SiteContentMap } from "@/lib/content/get-site-content";

const DESCRIPTION = "How MarketLoopAI collects, uses, and protects your information.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy",
    description: DESCRIPTION,
    url: "/privacy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: {
  id: string;
  heading: string;
  content: (string | { list: string[] })[];
}[] = [
  {
    id: "introduction",
    heading: "Introduction",
    content: [
      "This Privacy Policy explains how MarketLoopAI (\"we\", \"us\", \"our\") collects, uses, discloses, and safeguards information when you visit marketloopai.com, join our waitlist, or otherwise interact with us. We are currently in a pre-launch phase; this policy will be extended as the product and its features go live.",
    ],
  },
  {
    id: "information-we-collect",
    heading: "Information We Collect",
    content: [
      "We collect information you provide directly to us, information collected automatically when you use our site, and information from third-party services you choose to connect.",
    ],
  },
  {
    id: "information-you-provide",
    heading: "Information You Provide",
    content: [
      {
        list: [
          "Waitlist signup details: name, email address, company, website, business type, company size, current marketing tools, monthly ad spend, and features you're interested in",
          "Contact form submissions: name, email address, subject, and message",
          "Any other information you choose to send us directly, such as via email",
        ],
      },
    ],
  },
  {
    id: "automatic-information",
    heading: "Information Collected Automatically",
    content: [
      "When you visit our site, we and our service providers may automatically collect certain information, such as your IP address, browser type, device information, pages viewed, referring URL, and timestamps, typically through cookies and similar technologies.",
    ],
  },
  {
    id: "cookies",
    heading: "Cookies and Tracking Technologies",
    content: [
      "We use cookies and similar technologies to operate our site, remember your preferences, and understand how visitors use our site. See our Cookie Policy for details on the categories of cookies we use and how to manage your preferences.",
    ],
  },
  {
    id: "analytics-data",
    heading: "Analytics Data",
    content: [
      "We may use analytics providers (such as privacy-respecting or standard web analytics tools) to understand aggregate site usage, such as page views, session duration, and traffic sources. Analytics cookies are only set with your consent where required by law.",
    ],
  },
  {
    id: "waitlist-information",
    heading: "Waitlist Information",
    content: [
      "Waitlist submissions are stored securely and used to notify you about early access, product updates, and launch pricing. Each signup receives a unique referral code; if you were referred by someone else's code, we store that association to support our referral program.",
    ],
  },
  {
    id: "account-information",
    heading: "Account Information",
    content: [
      "If you create an account (for example, to sign in and view your referral status), we collect your email address and authentication details via our authentication provider (Supabase Auth), including Google sign-in or magic-link email sign-in.",
    ],
  },
  {
    id: "social-integrations",
    heading: "Social Media Integrations",
    content: [
      "Once MarketLoopAI launches its multi-platform content and advertising features, connecting content platform accounts (such as LinkedIn, TikTok, Snapchat, X, Facebook, or Instagram) or ad platform accounts (such as TikTok Ads, Snapchat Ads, X Ads, Google Ads, or Facebook/Meta Ads) will require additional authorization scoped to those platforms. We will update this policy with specifics before those integrations go live.",
    ],
  },
  {
    id: "payment-information",
    heading: "Payment Information (Future Support)",
    content: [
      "We do not currently process payments. When paid plans launch, payment information will be handled by a PCI-compliant third-party payment processor, and we will not store full card numbers on our servers.",
    ],
  },
  {
    id: "ai-processing",
    heading: "AI Processing and Generated Content",
    content: [
      "Product features that repurpose, generate, humanize, and rank content, and produce video ad creative, using AI will process the inputs you provide (such as a prompt, product description, or existing content) through our AI infrastructure and, where applicable, third-party AI providers, solely to produce the output you request.",
    ],
  },
  {
    id: "third-party-services",
    heading: "Third-Party Services",
    content: [
      "We rely on third-party service providers to operate our site and waitlist, including Supabase (database, authentication, storage) and Resend (transactional email). These providers process data on our behalf under their own security and privacy commitments.",
    ],
  },
  {
    id: "data-storage",
    heading: "Data Storage",
    content: [
      "Data is stored in Supabase-managed PostgreSQL databases. We take reasonable steps to ensure data is stored securely and access is limited to what's necessary to operate the service.",
    ],
  },
  {
    id: "data-security",
    heading: "Data Security",
    content: [
      "We use industry-standard measures, including encryption in transit (TLS) and row-level security policies restricting direct data access, to protect information from unauthorized access, alteration, or disclosure. No method of transmission or storage is 100% secure.",
    ],
  },
  {
    id: "data-retention",
    heading: "Data Retention",
    content: [
      "We retain waitlist and account information for as long as needed to provide our services, comply with legal obligations, resolve disputes, and enforce agreements. You may request deletion at any time (see Account Deletion below).",
    ],
  },
  {
    id: "childrens-privacy",
    heading: "Children's Privacy",
    content: [
      "Our site is not directed to children under 16, and we do not knowingly collect personal information from children. If you believe a child has provided us information, contact us and we will delete it.",
    ],
  },
  {
    id: "international-transfers",
    heading: "International Data Transfers",
    content: [
      "Your information may be processed in countries other than your own. Where required, we rely on appropriate safeguards (such as standard contractual clauses) for cross-border transfers.",
    ],
  },
  {
    id: "user-rights",
    heading: "User Rights",
    content: [
      "Depending on your location, you may have the right to access, correct, delete, or export your personal information, and to object to or restrict certain processing. Contact us to exercise these rights.",
    ],
  },
  {
    id: "gdpr",
    heading: "GDPR Compliance",
    content: [
      "For individuals in the European Economic Area and UK, we process personal data on the basis of consent, legitimate interests, or contractual necessity, as applicable. You have the rights described above under the GDPR and may lodge a complaint with your local supervisory authority.",
    ],
  },
  {
    id: "ccpa",
    heading: "CCPA Compliance",
    content: [
      "California residents have the right to know what personal information is collected, request deletion, and opt out of the sale or sharing of personal information. We do not sell personal information as defined under the CCPA.",
    ],
  },
  {
    id: "cookie-management",
    heading: "Cookie Management",
    content: [
      "You can manage your cookie preferences at any time using the cookie consent banner on our site, or through your browser settings. Disabling certain cookies may affect site functionality.",
    ],
  },
  {
    id: "marketing-communications",
    heading: "Marketing Communications",
    content: [
      "If you join our waitlist or subscribe to updates, we may email you about launch progress, new features, and related announcements. You can unsubscribe at any time using the link in those emails.",
    ],
  },
  {
    id: "account-deletion",
    heading: "Account Deletion",
    content: [
      "You may request deletion of your waitlist entry or account at any time by contacting us. We will remove your personal information within a reasonable timeframe, except where retention is required by law.",
    ],
  },
  {
    id: "data-export",
    heading: "Data Export Requests",
    content: [
      "You may request a copy of the personal information we hold about you in a portable format by contacting us using the details below.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to This Privacy Policy",
    content: [
      "We may update this Privacy Policy from time to time. We will update the \"Last updated\" date above and, for material changes, provide additional notice where appropriate.",
    ],
  },
  {
    id: "contact",
    heading: "Contact Information",
    content: ["Questions about this Privacy Policy can be sent to privacy@marketloopai.com."],
  },
];

function buildSections(content: SiteContentMap): LegalSection[] {
  return RAW_SECTIONS.map((section) => {
    const headingKey = `privacy.section.${section.id}.heading`;
    return {
      id: section.id,
      heading: getText(content, headingKey, section.heading),
      headingKey,
      content: section.content.map((block, i) => {
        if (typeof block === "string") {
          const key = `privacy.section.${section.id}.body.${i}`;
          return { text: getText(content, key, block), key };
        }
        return {
          list: block.list.map((item, j) => {
            const key = `privacy.section.${section.id}.list.${i}.${j}`;
            return { text: getText(content, key, item), key };
          }),
        };
      }),
    };
  });
}

export default async function PrivacyPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "privacy.pagehero.eyebrow", "Legal")}
      eyebrowKey="privacy.pagehero.eyebrow"
      title={getText(content, "privacy.pagehero.title", "Privacy Policy")}
      titleKey="privacy.pagehero.title"
      lastUpdated="July 20, 2026"
      sections={buildSections(content)}
    />
  );
}

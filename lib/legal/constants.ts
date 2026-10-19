export const LEGAL_LAST_UPDATED = "October 19, 2026";

export const LEGAL_CONTACTS = {
  legal: "legal@marketloopai.com",
  privacy: "privacy@marketloopai.com",
  security: "security@marketloopai.com",
} as const;

export const LEGAL_SITE = "https://marketloopai.com";

/** One sentence used at the end of every policy so the suite stays cross-linked. */
export const LEGAL_INDEX_SENTENCE =
  "The full MarketLoopAI legal suite (Terms, Privacy, Acceptable Use, Cookies, AI Policy, DPA, Subprocessors, Platform Integrations, Data Deletion, Google API disclosure, Copyright, Refunds, and Referral Terms) is listed at marketloopai.com/legal.";

export type LegalDoc = {
  href: string;
  title: string;
  group: "core" | "privacy" | "product" | "trust";
  description: string;
};

export const LEGAL_DOCUMENTS: LegalDoc[] = [
  {
    href: "/terms",
    title: "Terms of Service",
    group: "core",
    description:
      "The master agreement for the SaaS: accounts, credits, AI video, publishing, ads, liability, and incorporated policies.",
  },
  {
    href: "/acceptable-use",
    title: "Acceptable Use Policy",
    group: "core",
    description:
      "Prohibited uses of generation, publishing, and advertising, including scams, deepfakes, and platform-policy violations.",
  },
  {
    href: "/privacy",
    title: "Privacy Policy",
    group: "privacy",
    description:
      "How we collect and use personal data and Customer Content in the EEA/UK, United States, and other regions.",
  },
  {
    href: "/cookies",
    title: "Cookie Policy",
    group: "privacy",
    description:
      "Cookies and similar technologies on the website and in the application, including ePrivacy/PECR consent.",
  },
  {
    href: "/dpa",
    title: "Data Processing Addendum",
    group: "privacy",
    description:
      "GDPR Article 28 / UK GDPR processor terms for Customer Content, including subprocessors, SCCs, and breach notice.",
  },
  {
    href: "/subprocessors",
    title: "Subprocessors",
    group: "privacy",
    description:
      "Infrastructure and AI compute providers that process Customer Content on our behalf.",
  },
  {
    href: "/platform-integrations",
    title: "Platform Integrations Policy",
    group: "product",
    description:
      "Meta, Google, TikTok, Snapchat, X, and LinkedIn API data, scopes, and developer-terms compliance for app review.",
  },
  {
    href: "/data-deletion",
    title: "User Data Deletion",
    group: "privacy",
    description:
      "How to disconnect integrations and delete Facebook, Instagram, Google, and other platform data (Meta deletion URL).",
  },
  {
    href: "/google-api",
    title: "Google API Disclosure",
    group: "privacy",
    description:
      "Google Sign-In and Google Ads API data use, including Limited Use under the Google API Services User Data Policy.",
  },
  {
    href: "/ai",
    title: "AI Policy",
    group: "product",
    description:
      "Roles under the EU AI Act, synthetic-media labeling, no-training stance, and customer review duties.",
  },
  {
    href: "/copyright",
    title: "Copyright and DMCA",
    group: "product",
    description:
      "How we handle copyright complaints, counter-notices, and repeat infringement for hosted and generated media.",
  },
  {
    href: "/refunds",
    title: "Refund Policy",
    group: "product",
    description:
      "Subscriptions, generation credits, EU/UK consumer cooling-off, and third-party ad spend.",
  },
  {
    href: "/referral-terms",
    title: "Referral Program Terms",
    group: "product",
    description:
      "Waitlist referral ranking, eligibility, and the rules against fake or self-referrals.",
  },
  {
    href: "/security",
    title: "Security",
    group: "trust",
    description:
      "Technical and organizational measures: tenant isolation, encryption, GPU workers, and vulnerability reporting.",
  },
  {
    href: "/trust",
    title: "Trust Center",
    group: "trust",
    description:
      "How we approach security, privacy, and compliance readiness across the SaaS.",
  },
];

export const LEGAL_GROUP_LABELS: Record<LegalDoc["group"], string> = {
  core: "Core agreements",
  privacy: "Privacy and data",
  product: "Product rules",
  trust: "Trust",
};

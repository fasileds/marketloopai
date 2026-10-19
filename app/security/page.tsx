import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { getSiteContent, getText, type SiteContentMap } from "@/lib/content/get-site-content";
import { LEGAL_LAST_UPDATED } from "@/lib/legal/constants";

const DESCRIPTION =
  "How MarketLoopAI protects accounts, Customer Content, AI video jobs, and connected social and advertising platforms across the SaaS.";

export const metadata: Metadata = {
  title: "Security",
  description: DESCRIPTION,
  alternates: { canonical: "/security" },
  openGraph: {
    title: "Security",
    description: DESCRIPTION,
    url: "/security",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Security",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: {
  id: string;
  heading: string;
  content: (string | { list: string[] })[];
}[] = [
  {
    id: "overview",
    heading: "1. Overview",
    content: [
      "This page describes how we approach security for the MarketLoopAI SaaS — the marketing site, the application, AI generation (including self-hosted video models such as Wan 2.2), storage of prompts and media, publishing, and ad campaign management. Processor terms are in the DPA; vendors are listed on the Subprocessors page.",
      "No system is perfectly secure. We design for defense in depth and will keep raising the bar as the product grows. See also the Privacy Policy and Trust Center.",
    ],
  },
  {
    id: "infrastructure",
    heading: "2. Infrastructure",
    content: [
      "The web application is hosted on Vercel. Database, authentication, and object storage use Supabase. Payments use Stripe. Email uses a transactional provider such as Resend. Generation jobs may run on GPU workers we operate in a cloud account, isolated from the public internet except for required egress (for example to write outputs to storage).",
      "Those providers maintain their own security and compliance programs. We configure our tenants to least privilege where the platform allows it.",
    ],
  },
  {
    id: "encryption",
    heading: "3. Encryption",
    content: [
      "Data is encrypted in transit with TLS. Data at rest uses our infrastructure providers' storage-level encryption. Private media (generated videos, uploads) is intended to be served via short-lived signed URLs rather than public buckets.",
    ],
  },
  {
    id: "authentication",
    heading: "4. Authentication",
    content: [
      "Sign-in uses Supabase Auth: Google OAuth and passwordless magic-link email. We do not store plaintext passwords for magic-link accounts. Sessions are cookie-based and scoped to our domains.",
      "Organization owners should revoke access when people leave. We recommend using a company-controlled email address.",
    ],
  },
  {
    id: "tenant-isolation",
    heading: "5. Tenant isolation",
    content: [
      "The product is multi-tenant. Access to organization data is enforced with Row Level Security (RLS) in the database and with server-side checks on API routes. Members should only see workspaces they belong to. Sensitive tables (waitlist, admin, billing metadata) are not publicly readable or writable from the browser.",
    ],
  },
  {
    id: "customer-content",
    heading: "6. Prompts, assets, and generation jobs",
    content: [
      "Customer Content (prompts, uploads, outputs, job records) is stored per organization. GPU workers receive only the payload needed for a job plus credentials sufficient to write the result. Workers are not given the database service role for arbitrary queries.",
      "We may scan inputs and outputs for malware, policy violations, or illegal content. We do not use your prompts or media to train public foundation models unless you opt into a separate program.",
    ],
  },
  {
    id: "connected-platforms",
    heading: "7. Social and ads connections",
    content: [
      "When you connect LinkedIn, TikTok, Snapchat, X, Facebook, Instagram, Google Ads, Meta Ads, or similar platforms, we store OAuth tokens and account identifiers needed to publish or manage campaigns on your behalf.",
      "Tokens are stored server-side, not in client JavaScript. Scopes should be limited to what the feature needs. You can disconnect an integration; we then stop using the token. You remain responsible for the security of the connected ad accounts and for who you invite into your MarketLoopAI organization.",
    ],
  },
  {
    id: "payments",
    heading: "8. Payments",
    content: [
      "Card data is handled by Stripe. We store customer and subscription identifiers, not full card numbers. Webhooks are verified with Stripe signatures.",
    ],
  },
  {
    id: "api-security",
    heading: "9. Application and API security",
    content: [
      "API routes validate input with schema validation (Zod) before processing. Secrets and service-role keys stay on the server. Admin routes require an authenticated, authorized user. Rate limits and credit reservation reduce abuse of generation capacity.",
    ],
  },
  {
    id: "backups",
    heading: "10. Backups and availability",
    content: [
      "Managed database backups are provided by our database vendor on their schedule. Object storage durability follows the provider's design. Generation capacity depends on GPU availability; jobs may queue. We monitor errors and uptime as the Service scales.",
    ],
  },
  {
    id: "incident-response",
    heading: "11. Incident response",
    content: [
      "If we confirm a security incident that affects personal data or Customer Content, we will investigate, contain, and notify affected customers and, where legally required, authorities without undue delay.",
    ],
  },
  {
    id: "vulnerability-reporting",
    heading: "12. Vulnerability reporting",
    content: [
      "If you believe you found a vulnerability, email security@marketloopai.com with enough detail to reproduce it. Do not access or modify data beyond what is needed to demonstrate the issue, and do not run destructive tests against production.",
    ],
  },
  {
    id: "responsible-disclosure",
    heading: "13. Responsible disclosure",
    content: [
      "Give us reasonable time to investigate and fix a reported issue before public disclosure. We will not pursue legal action against researchers who act in good faith, stay within this policy, and do not harm users or the Service.",
    ],
  },
  {
    id: "security-contact",
    heading: "14. Contact",
    content: [
      "Security: security@marketloopai.com. Privacy: privacy@marketloopai.com. The full legal suite is at marketloopai.com/legal.",
    ],
  },
];

function buildSections(content: SiteContentMap): LegalSection[] {
  return RAW_SECTIONS.map((section) => {
    const headingKey = `security.section.${section.id}.heading`;
    return {
      id: section.id,
      heading: getText(content, headingKey, section.heading),
      headingKey,
      content: section.content.map((block, i) => {
        if (typeof block === "string") {
          const key = `security.section.${section.id}.body.${i}`;
          return { text: getText(content, key, block), key };
        }
        return {
          list: block.list.map((item, j) => {
            const key = `security.section.${section.id}.list.${i}.${j}`;
            return { text: getText(content, key, item), key };
          }),
        };
      }),
    };
  });
}

export default async function SecurityPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "security.pagehero.eyebrow", "Trust")}
      eyebrowKey="security.pagehero.eyebrow"
      title={getText(content, "security.pagehero.title", "Security")}
      titleKey="security.pagehero.title"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={buildSections(content)}
    />
  );
}

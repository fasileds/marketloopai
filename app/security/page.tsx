import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { getSiteContent, getText, type SiteContentMap } from "@/lib/content/get-site-content";

export const metadata: Metadata = {
  title: "Security",
  description: "How MarketLoopAI approaches infrastructure, data, and application security.",
};

const RAW_SECTIONS: {
  id: string;
  heading: string;
  content: (string | { list: string[] })[];
}[] = [
  {
    id: "infrastructure",
    heading: "Infrastructure Overview",
    content: [
      "MarketLoopAI is built on Vercel for hosting and Supabase for our database, authentication, and storage layer — both established providers with their own security programs and compliance certifications.",
    ],
  },
  {
    id: "encryption",
    heading: "Data Encryption",
    content: [
      "Data is encrypted in transit using TLS. Data at rest in our database is encrypted using our infrastructure provider's storage-level encryption.",
    ],
  },
  {
    id: "authentication",
    heading: "Authentication",
    content: [
      "Account sign-in is handled via Supabase Auth, supporting Google OAuth and passwordless magic-link email sign-in. We never store plaintext passwords for magic-link accounts.",
    ],
  },
  {
    id: "supabase-security",
    heading: "Supabase Security",
    content: [
      "Our database uses Row Level Security (RLS) policies so that data access is enforced at the database layer, not just in application code. Sensitive tables (like our waitlist) have no public read/write access — all writes go through server-side, service-role-authenticated API routes.",
    ],
  },
  {
    id: "api-security",
    heading: "API Security",
    content: [
      "Our API routes validate all input with schema validation (Zod) before processing, and sensitive operations use server-only credentials that are never exposed to the browser.",
    ],
  },
  {
    id: "data-backup",
    heading: "Data Backup",
    content: [
      "Our database provider performs regular automated backups as part of its managed service. We recommend reviewing our provider's specific backup and disaster recovery documentation for details.",
    ],
  },
  {
    id: "incident-response",
    heading: "Incident Response",
    content: [
      "In the event of a confirmed security incident affecting personal data, we will investigate promptly and notify affected users and, where legally required, relevant authorities without undue delay.",
    ],
  },
  {
    id: "vulnerability-reporting",
    heading: "Vulnerability Reporting",
    content: [
      "If you believe you've found a security vulnerability in our site or services, please report it to security@marketloopai.com with enough detail to reproduce the issue.",
    ],
  },
  {
    id: "responsible-disclosure",
    heading: "Responsible Disclosure",
    content: [
      "We ask that you give us reasonable time to investigate and address a reported issue before public disclosure, and that you avoid accessing or modifying data beyond what's needed to demonstrate the issue.",
    ],
  },
  {
    id: "security-contact",
    heading: "Security Contact",
    content: ["Reach our team directly at security@marketloopai.com."],
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
      lastUpdated="July 20, 2026"
      sections={buildSections(content)}
    />
  );
}

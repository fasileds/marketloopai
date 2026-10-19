import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { buildLegalSections, type RawLegalSection } from "@/lib/legal/build-sections";
import { LEGAL_INDEX_SENTENCE, LEGAL_LAST_UPDATED } from "@/lib/legal/constants";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const DESCRIPTION =
  "MarketLoopAI Data Processing Addendum (GDPR Article 28, UK GDPR, and similar laws) for Customer Content processed in the SaaS.";

export const metadata: Metadata = {
  title: "Data Processing Addendum",
  description: DESCRIPTION,
  alternates: { canonical: "/dpa" },
  openGraph: {
    title: "Data Processing Addendum",
    description: DESCRIPTION,
    url: "/dpa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Processing Addendum",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: RawLegalSection[] = [
  {
    id: "agreement",
    heading: "1. Agreement and order of precedence",
    content: [
      "This Data Processing Addendum (\"DPA\") is part of the MarketLoopAI Terms of Service (the \"Agreement\"). It applies when MarketLoopAI processes personal data in Customer Content on behalf of a customer organization (the \"Controller\") to provide the Service.",
      "If you need a signed copy, email privacy@marketloopai.com from an organization-owner address. This public DPA is the standard processor terms unless we execute a different version in writing.",
      "If this DPA conflicts with the Privacy Policy on processor obligations for Customer Content, this DPA controls. If it conflicts with the Agreement on any other topic, the Agreement controls except where Data Protection Law requires otherwise.",
    ],
  },
  {
    id: "roles",
    heading: "2. Roles",
    content: [
      "The customer organization is the controller (or a processor for its own clients, in which case MarketLoopAI is a subprocessor). MarketLoopAI is the processor of Customer Content personal data.",
      "MarketLoopAI is an independent controller of account, billing, waitlist, website, and security data, as described in the Privacy Policy. This DPA does not apply to that controller processing.",
      "Connected social and advertising platforms (Meta, Google, TikTok, Snapchat, X, LinkedIn, and others) are independent controllers of their own platform data. This DPA does not bind those platforms.",
    ],
  },
  {
    id: "subject-matter",
    heading: "3. Subject matter, duration, nature, and purpose",
    content: [
      "Subject matter: hosting, generating, storing, transmitting, and displaying Customer Content and related job, campaign, and analytics records needed to operate the Service.",
      "Nature and purpose: SaaS provision of AI content and video generation, storage, social publishing you instruct, ad campaign management you instruct, dashboards, and performance suggestions.",
      "Duration: the term of the Agreement plus a limited post-termination period for export, dispute handling, backups, and legal retention, as described in the Privacy Policy, then deletion or de-identification from production systems.",
      "Types of personal data depend on what the Controller submits or connects. They may include identifiers, contact details, images and video that depict people, voices, prompts that name people, campaign targeting parameters, and performance metrics. Categories of data subjects may include the Controller's staff, customers, audiences, and people depicted in creative.",
      "Special-category or sensitive data should not be submitted unless the Controller has a lawful basis and has configured the Service only as needed. We do not require such data to provide the Service.",
    ],
  },
  {
    id: "instructions",
    heading: "4. Instructions",
    content: [
      "MarketLoopAI will process Customer Content only on documented instructions: this DPA, the Agreement, settings and actions in the Service (including jobs you submit and campaigns you authorize), and written instructions from an organization owner or admin.",
      "We will inform the Controller if, in our opinion, an instruction infringes Data Protection Law, unless law prohibits that notice. We may suspend processing that we reasonably believe is unlawful.",
      "If law requires processing beyond instructions, we will notify the Controller before processing unless legally prohibited.",
    ],
  },
  {
    id: "confidentiality",
    heading: "5. Confidentiality",
    content: [
      "Persons we authorize to process Customer Content are bound by confidentiality (contract or statute) and access Customer Content only as needed to provide, secure, or support the Service.",
    ],
  },
  {
    id: "security",
    heading: "6. Security",
    content: [
      "We implement appropriate technical and organizational measures taking into account the state of the art, costs, nature of processing, and risk. Current measures are described on the Security page and include TLS, encryption at rest, tenant isolation (including row-level security), access control, signed URLs for private media, input validation, and isolation of GPU workers.",
      "The Controller is responsible for account hygiene, who it invites, what it uploads, and the security of connected ad accounts.",
    ],
  },
  {
    id: "subprocessors",
    heading: "7. Subprocessors",
    content: [
      "The Controller gives general written authorization for MarketLoopAI to appoint subprocessors listed at marketloopai.com/subprocessors, including replacements in the same category (for example a different GPU cloud region).",
      "We will impose data-protection obligations on subprocessors that are no less protective of Customer Content than this DPA in material respects.",
      "We will post material additions to the subprocessor list in advance where practicable (target: 15 days). The Controller may object on reasonable data-protection grounds by emailing privacy@marketloopai.com. If we cannot accommodate the objection, the Controller may terminate the affected Service as its sole remedy.",
      "Social and ads platforms you connect are not our subprocessors for this purpose.",
    ],
  },
  {
    id: "assistance",
    heading: "8. Data-subject rights, DPIAs, and consultation",
    content: [
      "Taking into account the nature of processing, we will assist the Controller with appropriate technical and organizational measures so the Controller can respond to data-subject requests regarding Customer Content. We will not respond to such a request as if we were the Controller, except to redirect the requester to the Controller or as required by law.",
      "We will provide reasonable assistance with data-protection impact assessments and prior consultation with a supervisory authority, to the extent the information is available to us and the request relates to our processing.",
    ],
  },
  {
    id: "breach",
    heading: "9. Personal-data breaches",
    content: [
      "We will notify the Controller without undue delay after becoming aware of a personal-data breach affecting Customer Content we process as processor, and will provide information reasonably available to us to help the Controller meet its notification duties.",
    ],
  },
  {
    id: "transfers",
    heading: "10. International transfers",
    content: [
      "Customer Content may be processed in countries other than the Controller's, including where hosting, backups, or GPU capacity is located.",
      "Where GDPR, UK GDPR, or similar law requires a transfer tool, we rely on an adequacy decision where one exists, and otherwise on the European Commission's Standard Contractual Clauses (and the UK International Data Transfer Addendum where required), including module 2 (controller to processor) or module 3 (processor to processor) as applicable. A copy of the SCCs as incorporated by this DPA is available on request.",
    ],
  },
  {
    id: "audits",
    heading: "11. Audits",
    content: [
      "On written request, no more than once per year (unless a competent authority or a documented incident reasonably requires more), we will provide information reasonably necessary to demonstrate compliance with this DPA, which may include security summaries or third-party reports when available.",
      "On-site audits, if required by Data Protection Law and not reasonably satisfied by documentation, must be scheduled in advance, limited to facilities and systems used for the Controller's Customer Content, conducted under confidentiality, and at the Controller's expense unless the audit reveals a material breach of this DPA by us.",
    ],
  },
  {
    id: "return-deletion",
    heading: "12. Return and deletion",
    content: [
      "At the end of the Service, the Controller may export Customer Content then available in the product. We will delete Customer Content from production systems within a reasonable period after termination or on written request, except copies retained as required by law, for dispute resolution, or in encrypted backups that expire on a rolling schedule.",
    ],
  },
  {
    id: "ccpa",
    heading: "13. US state privacy (including CCPA/CPRA)",
    content: [
      "To the extent we process personal information in Customer Content that is subject to the CCPA/CPRA or similar US state laws, we act as a service provider / processor. We will not sell or share that information as those terms are defined, retain it for any purpose other than providing the Service (or as permitted as a service provider), or combine it with other personal information except as allowed to provide the Service.",
      "We will notify the Controller if we determine we can no longer meet these obligations, and we will allow reasonable steps to stop and remediate unauthorized use.",
    ],
  },
  {
    id: "other-laws",
    heading: "14. Other data-protection laws",
    content: [
      "Where UK GDPR, Brazil's LGPD, Canada's PIPEDA, Australia's Privacy Act, Singapore's PDPA, or similar laws apply to Customer Content, we will process it only to provide the Service, keep it confidential, and assist the Controller with comparable obligations to the extent reasonably practicable.",
    ],
  },
  {
    id: "liability",
    heading: "15. Liability",
    content: [
      "Liability under this DPA is subject to the limitations and exclusions in the Agreement, except where Data Protection Law makes a limitation unenforceable as to a party's own administrative fine for its own infringement.",
    ],
  },
  {
    id: "contact",
    heading: "16. Contact",
    content: [
      "Privacy and DPA requests: privacy@marketloopai.com. " + LEGAL_INDEX_SENTENCE,
    ],
  },
];

export default async function DpaPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "dpa.pagehero.eyebrow", "Legal")}
      eyebrowKey="dpa.pagehero.eyebrow"
      title={getText(content, "dpa.pagehero.title", "Data Processing Addendum")}
      titleKey="dpa.pagehero.title"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={buildLegalSections(content, "dpa", RAW_SECTIONS)}
    />
  );
}

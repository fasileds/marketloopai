import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { getSiteContent, getText, type SiteContentMap } from "@/lib/content/get-site-content";
import { LEGAL_LAST_UPDATED } from "@/lib/legal/constants";

const DESCRIPTION =
  "Acceptable Use Policy for MarketLoopAI: rules for AI video generation, publishing, and ad campaign management across the SaaS.";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description: DESCRIPTION,
  alternates: { canonical: "/acceptable-use" },
  openGraph: {
    title: "Acceptable Use Policy",
    description: DESCRIPTION,
    url: "/acceptable-use",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acceptable Use Policy",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: {
  id: string;
  heading: string;
  content: (string | { list: string[] })[];
}[] = [
  {
    id: "purpose",
    heading: "1. Purpose",
    content: [
      "This Acceptable Use Policy (\"AUP\") is part of the MarketLoopAI Terms of Service. It applies to the entire Service: the website, waitlist, application, APIs, AI content and video generation, storage, social publishing, ad campaign management, analytics, and suggestions.",
      "If you use the Service on behalf of an organization, that organization is responsible for its users' compliance.",
    ],
  },
  {
    id: "lawful-use",
    heading: "2. Lawful use only",
    content: [
      "Use the Service only for lawful marketing and business purposes. You must comply with applicable law (including advertising, consumer protection, privacy, intellectual property, and election rules) and with the policies of every platform you connect (Meta, Google, TikTok, Snapchat, X, LinkedIn, and others), including their developer and API terms as described in the Platform Integrations Policy at marketloopai.com/platform-integrations.",
    ],
  },
  {
    id: "ai-video",
    heading: "3. AI generation and video",
    content: [
      "You must not use generation features (text, image, audio, video, or storyboards) to:",
      {
        list: [
          "Create, request, or distribute child sexual abuse material, or any sexual or exploitative content involving minors (anyone under 18). This is strictly prohibited and will be reported",
          "Create non-consensual intimate imagery, \"deepfake\" pornography, or sexual content of a real person without their consent",
          "Impersonate a real person or brand in a deceptive way, including fake endorsements",
          "Produce content that facilitates crime, violent extremism, or illegal weapons or drugs",
          "Infringe copyright, trademarks, or other rights, including uploading reference images you do not have rights to use",
          "Attempt to extract model weights, systematically scrape outputs to train a competing model, or reverse engineer hosted models except as allowed by mandatory law or an applicable open-source license (for example Apache 2.0 for Wan 2.2 itself)",
        ],
      },
      "You are responsible for reviewing outputs before you publish or run them as ads. AI outputs can be inaccurate, biased, or similar to existing works. Where law requires you to disclose that content is AI-generated or synthetic (including the EU AI Act and comparable rules), you must add those labels. See the AI Policy at marketloopai.com/ai.",
    ],
  },
  {
    id: "advertising",
    heading: "4. Advertising and campaign management",
    content: [
      "When you create, publish, or manage ads through the Service you must not:",
      {
        list: [
          "Run scams, phishing, fake shops, malware, or ads that hide the true advertiser",
          "Make deceptive claims, fake reviews, or misleading before/after creative",
          "Advertise prohibited or restricted products in violation of law or platform rules (including, where restricted: tobacco, weapons, adult content, gambling, financial or health claims, and similar categories)",
          "Target people in ways forbidden by the platform or by law (including sensitive categories and children's data)",
          "Run political, issue, or housing/employment/credit ads except where you have completed the platform's authorization and disclosures",
          "Circumvent platform review, spend limits, or another advertiser's account",
        ],
      },
      "You — not MarketLoopAI — are the advertiser of record. You pay ad spend on the connected platforms and must honor their rejection, policy, and billing decisions.",
    ],
  },
  {
    id: "publishing",
    heading: "5. Social publishing",
    content: [
      "Do not use connected social accounts to spam, harass, scrape other users, or post content that violates that network's terms. You must have the right to post on every page, profile, or ad account you connect, and you must revoke access when a person leaves your organization.",
    ],
  },
  {
    id: "accounts-capacity",
    heading: "6. Accounts, credits, and capacity",
    content: [
      "Do not:",
      {
        list: [
          "Share login credentials or allow unauthorized users into a workspace",
          "Create fake accounts, abuse waitlist or referral programs, or evade suspensions",
          "Bypass credit reservation, rate limits, concurrent-job limits, or storage caps",
          "Resell generation capacity or the Service itself without our written permission (agencies may use workspaces for named clients under their own contracts)",
          "Probe, scan, or attack the Service except through our responsible-disclosure process at security@marketloopai.com",
        ],
      },
    ],
  },
  {
    id: "data",
    heading: "7. Other people's data",
    content: [
      "Do not upload personal data, faces, voices, or customer lists unless you have a lawful basis and the rights needed to process them in an AI system and in ads. Do not use the Service to build dossiers, stalk, or discriminate unlawfully.",
    ],
  },
  {
    id: "enforcement",
    heading: "8. Enforcement",
    content: [
      "We may investigate, refuse jobs, remove content, disconnect integrations, suspend credits, or terminate accounts. We may report illegal activity to platforms and authorities. We are not obligated to monitor all content, but we may do so to operate and protect the Service.",
    ],
  },
  {
    id: "reporting",
    heading: "9. Reporting abuse",
    content: [
      "Report abuse or illegal content to legal@marketloopai.com. Security issues: security@marketloopai.com. Include URLs, job IDs, or account names if you have them. Copyright notices follow marketloopai.com/copyright. EU Digital Services Act notices of illegal content may use the same legal address.",
    ],
  },
  {
    id: "changes",
    heading: "10. Changes",
    content: [
      "We may update this AUP. The current version is posted on this page. Continued use of the Service after an update means you accept the revised AUP. If this page conflicts with the Terms of Service, the Terms control except that this AUP may be more specific about prohibited uses. The full legal suite is at marketloopai.com/legal.",
    ],
  },
];

function buildSections(content: SiteContentMap): LegalSection[] {
  return RAW_SECTIONS.map((section) => {
    const headingKey = `aup.section.${section.id}.heading`;
    return {
      id: section.id,
      heading: getText(content, headingKey, section.heading),
      headingKey,
      content: section.content.map((block, i) => {
        if (typeof block === "string") {
          const key = `aup.section.${section.id}.body.${i}`;
          return { text: getText(content, key, block), key };
        }
        return {
          list: block.list.map((item, j) => {
            const key = `aup.section.${section.id}.list.${i}.${j}`;
            return { text: getText(content, key, item), key };
          }),
        };
      }),
    };
  });
}

export default async function AcceptableUsePage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "aup.pagehero.eyebrow", "Legal")}
      eyebrowKey="aup.pagehero.eyebrow"
      title={getText(content, "aup.pagehero.title", "Acceptable Use Policy")}
      titleKey="aup.pagehero.title"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={buildSections(content)}
    />
  );
}

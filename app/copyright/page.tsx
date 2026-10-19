import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { buildLegalSections, type RawLegalSection } from "@/lib/legal/build-sections";
import { LEGAL_INDEX_SENTENCE, LEGAL_LAST_UPDATED } from "@/lib/legal/constants";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const DESCRIPTION =
  "Copyright complaints, DMCA-style notices, and repeat-infringer rules for content hosted or generated on MarketLoopAI.";

export const metadata: Metadata = {
  title: "Copyright and DMCA",
  description: DESCRIPTION,
  alternates: { canonical: "/copyright" },
  openGraph: {
    title: "Copyright and DMCA",
    description: DESCRIPTION,
    url: "/copyright",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Copyright and DMCA",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: RawLegalSection[] = [
  {
    id: "respect",
    heading: "1. Respect for rights",
    content: [
      "MarketLoopAI respects intellectual property. You must have the rights needed for everything you upload, generate, publish, or run as an ad. AI output is not a guarantee that the result is free of third-party rights. This policy is part of the Terms of Service.",
    ],
  },
  {
    id: "notice",
    heading: "2. Copyright notice (including DMCA)",
    content: [
      "If you believe content hosted on the Service infringes your copyright, send a notice to legal@marketloopai.com with:",
      {
        list: [
          "Your name, mailing address, telephone number, and email",
          "Identification of the copyrighted work (or a representative list)",
          "The location of the allegedly infringing material on MarketLoopAI (URL, organization name, job ID, or filename)",
          "A statement that you have a good-faith belief the use is not authorized by the owner, its agent, or the law",
          "A statement, under penalty of perjury, that the information is accurate and that you are the owner or authorized to act",
          "Your physical or electronic signature",
        ],
      },
      "This process is designed to align with the US Digital Millennium Copyright Act (17 U.S.C. § 512) and to give us enough information to act in other countries. We may share the notice with the user who posted the material.",
      "Designated agent for copyright: legal@marketloopai.com. A physical address will be provided on request for formal service.",
    ],
  },
  {
    id: "counter",
    heading: "3. Counter-notice",
    content: [
      "If your material was removed and you believe it was a mistake or misidentification, you may send a counter-notice to the same address including your contact details, identification of the removed material, a statement under penalty of perjury that you have a good-faith belief it was removed by mistake, consent to the jurisdiction of the courts of the jurisdiction in which MarketLoopAI is organized (or, for US-based filers, the federal district of your address), and your signature.",
      "We may restore the material after a waiting period unless the original complainant seeks a court order, as applicable law allows.",
    ],
  },
  {
    id: "repeat",
    heading: "4. Repeat infringement",
    content: [
      "We may terminate accounts that are repeat infringers or that clearly use the Service to infringe, in appropriate circumstances.",
    ],
  },
  {
    id: "other-ip",
    heading: "5. Trademarks and other rights",
    content: [
      "Trademark, publicity, and similar complaints may be sent to legal@marketloopai.com. We may remove or restrict content that we reasonably believe infringes or violates the Acceptable Use Policy, including impersonation and unauthorized brand use in ads.",
    ],
  },
  {
    id: "eu-dsa",
    heading: "6. Illegal-content notices (EU Digital Services Act)",
    content: [
      "Users and third parties in the EU may report allegedly illegal content (including copyright infringement) to legal@marketloopai.com. Include a clear URL or job ID, the legal reason, and a good-faith statement. We will review notices and inform the reporter of our decision where required.",
    ],
  },
  {
    id: "contact",
    heading: "7. Contact",
    content: [
      "Copyright: legal@marketloopai.com. " + LEGAL_INDEX_SENTENCE,
    ],
  },
];

export default async function CopyrightPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "copyright.pagehero.eyebrow", "Legal")}
      eyebrowKey="copyright.pagehero.eyebrow"
      title={getText(content, "copyright.pagehero.title", "Copyright and DMCA")}
      titleKey="copyright.pagehero.title"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={buildLegalSections(content, "copyright", RAW_SECTIONS)}
    />
  );
}

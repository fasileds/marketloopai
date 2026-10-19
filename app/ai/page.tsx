import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { buildLegalSections, type RawLegalSection } from "@/lib/legal/build-sections";
import { LEGAL_INDEX_SENTENCE, LEGAL_LAST_UPDATED } from "@/lib/legal/constants";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const DESCRIPTION =
  "How MarketLoopAI uses AI in the SaaS, including EU AI Act roles, synthetic-media labeling, and the rule that we do not train public models on Customer Content.";

export const metadata: Metadata = {
  title: "AI Policy",
  description: DESCRIPTION,
  alternates: { canonical: "/ai" },
  openGraph: {
    title: "AI Policy",
    description: DESCRIPTION,
    url: "/ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Policy",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: RawLegalSection[] = [
  {
    id: "scope",
    heading: "1. Scope",
    content: [
      "This AI Policy is part of the Terms of Service and should be read with the Acceptable Use Policy, Privacy Policy, and Data Processing Addendum. It applies to AI features in the Service: content generation and humanization, ranking, video and storyboards, captions, campaign suggestions, and similar automated tools.",
    ],
  },
  {
    id: "roles",
    heading: "2. Roles (EU AI Act and similar laws)",
    content: [
      "When we make AI features available as part of the Service, MarketLoopAI acts as a provider of those tools (and, for self-hosted open-source components such as Wan 2.2, as a deployer of that model into our infrastructure).",
      "When you use the Service to generate, publish, or advertise, you are the deployer of the AI system for your campaigns. You decide prompts, uploads, whether to publish, targeting, and budgets. You must comply with the EU AI Act and other AI laws that apply to your use, including transparency toward end users of your ads and posts.",
      "Used as intended for marketing creative and campaign operations, and in line with the Acceptable Use Policy, these features are intended as tools that assist professionals — not as high-risk AI systems for credit, employment, essential services, or law enforcement. You must not use the Service for those high-risk purposes.",
    ],
  },
  {
    id: "transparency",
    heading: "3. Transparency and labeling",
    content: [
      "Outputs are machine-generated. They can be wrong, biased, off-brand, or similar to existing works. You must review them before you rely on them.",
      "Where law requires disclosure that content is AI-generated or synthetic (including EU AI Act transparency rules for certain deep-synthetic audio, image, or video, and comparable US state or platform rules), you are responsible for labeling, watermarks, or notices in the content you publish or run as ads. We may add technical provenance or watermarks when available; that does not replace your legal duty.",
      "Do not present generated people, testimonials, or endorsements as real without a lawful basis and required disclosures (including advertising and consumer-protection rules in the US, EU, UK, and other markets).",
    ],
  },
  {
    id: "training",
    heading: "4. Training and improvement",
    content: [
      "We do not use your prompts, uploads, or generated media to train public foundation models unless you opt in to a separate, clearly disclosed program.",
      "We may use de-identified or aggregated operational metrics (for example job success rates) to run and improve the Service. Safety filters may inspect inputs and outputs for malware, abuse, or illegal content.",
    ],
  },
  {
    id: "models",
    heading: "5. Models and subprocessors",
    content: [
      "Video generation may use self-hosted models such as Wan 2.2 (Apache 2.0) on GPU workers. Other models or third-party APIs may be added as optional or overflow capacity; material providers are listed on the Subprocessors page or in the product.",
      "Open-source licenses continue to apply to those components. Model authors typically claim no rights in your outputs and require lawful use.",
    ],
  },
  {
    id: "likeness",
    heading: "6. People, brands, and deepfakes",
    content: [
      "You must have rights and a lawful basis to use faces, voices, names, and trademarks you upload or request. Non-consensual intimate imagery, sexual deepfakes, child sexual abuse material, and deceptive impersonation are prohibited (see the Acceptable Use Policy).",
      "You are responsible for publicity, personality, and trademark rights in every market where you publish or advertise.",
    ],
  },
  {
    id: "ads",
    heading: "7. Advertising use",
    content: [
      "If you use outputs in ads, you — not MarketLoopAI — are the advertiser of record. You must comply with platform advertising policies and with marketing law (including the FTC's advertising rules in the United States, the UCPD and related guidance in the EU, CAP/ASA in the UK, and local equivalents).",
      "Ranking and \"winner\" suggestions are automated opinions, not a guarantee of performance or legal compliance.",
    ],
  },
  {
    id: "limitations",
    heading: "8. Limitations",
    content: [
      "We do not warrant uniqueness, non-infringement, or fitness for a regulated claim (health, finance, environment, or similar). Human review remains your obligation.",
    ],
  },
  {
    id: "contact",
    heading: "9. Contact",
    content: [
      "Questions: legal@marketloopai.com. " + LEGAL_INDEX_SENTENCE,
    ],
  },
];

export default async function AiPolicyPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "aipolicy.pagehero.eyebrow", "Legal")}
      eyebrowKey="aipolicy.pagehero.eyebrow"
      title={getText(content, "aipolicy.pagehero.title", "AI Policy")}
      titleKey="aipolicy.pagehero.title"
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={buildLegalSections(content, "aipolicy", RAW_SECTIONS)}
    />
  );
}

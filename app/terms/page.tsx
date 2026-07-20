import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { getSiteContent, getText, type SiteContentMap } from "@/lib/content/get-site-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of MarketLoopAI.",
};

const RAW_SECTIONS: {
  id: string;
  heading: string;
  content: (string | { list: string[] })[];
}[] = [
  {
    id: "acceptance",
    heading: "Acceptance of Terms",
    content: [
      "By accessing marketloopai.com, joining our waitlist, or using any MarketLoopAI service, you agree to be bound by these Terms of Service. If you don't agree, please don't use our site or services.",
    ],
  },
  {
    id: "eligibility",
    heading: "Eligibility",
    content: [
      "You must be at least 16 years old and able to form a binding contract to use our services. By using MarketLoopAI, you represent that you meet these requirements.",
    ],
  },
  {
    id: "user-accounts",
    heading: "User Accounts",
    content: [
      "Some features require an account, created via Google sign-in or email magic link. You're responsible for maintaining the confidentiality of your account and for all activity under it.",
    ],
  },
  {
    id: "waitlist-registration",
    heading: "Waitlist Registration",
    content: [
      "Joining the waitlist does not guarantee access to the product, a specific launch date, or specific pricing. Waitlist position and referral rewards are provided at our discretion and may change as we refine the program.",
    ],
  },
  {
    id: "acceptable-use",
    heading: "Acceptable Use Policy",
    content: [
      "You agree not to misuse our site or services, including by attempting unauthorized access, interfering with normal operation, scraping at scale, or using the waitlist referral system fraudulently (e.g., fake signups).",
    ],
  },
  {
    id: "intellectual-property",
    heading: "Intellectual Property",
    content: [
      "MarketLoopAI's branding, site design, and underlying software are owned by us or our licensors and protected by intellectual property laws. Nothing in these Terms grants you rights to our trademarks or proprietary content beyond normal use of the site.",
    ],
  },
  {
    id: "ai-generated-content",
    heading: "AI Generated Content",
    content: [
      "When AI content and video generation features launch, output is generated based on your inputs. You're responsible for reviewing generated content before publishing it, and for ensuring your use complies with applicable law and third-party platform policies.",
    ],
  },
  {
    id: "user-content",
    heading: "User Content",
    content: [
      "You retain ownership of content you submit to us (such as website URLs, prompts, or brand assets). You grant us a license to process that content solely to provide the requested service.",
    ],
  },
  {
    id: "platform-availability",
    heading: "Platform Availability",
    content: [
      "We aim for high availability but don't guarantee uninterrupted access. The site and, once launched, the product may be unavailable for maintenance, updates, or reasons outside our control.",
    ],
  },
  {
    id: "subscription-plans",
    heading: "Subscription Plans (Future)",
    content: [
      "Paid subscription tiers described on our Pricing page are planned and subject to change before general availability. Specific terms will apply once subscriptions launch.",
    ],
  },
  {
    id: "billing",
    heading: "Billing (Future)",
    content: [
      "Once billing is enabled, subscriptions will be billed in advance on a recurring basis via our payment processor. You'll be able to view and manage billing details from your account.",
    ],
  },
  {
    id: "refund-policy",
    heading: "Refund Policy",
    content: [
      "Our refund policy will be published before paid plans launch. Nothing in these Terms currently obligates us to provide refunds, as no paid services are yet available.",
    ],
  },
  {
    id: "api-usage",
    heading: "API Usage",
    content: [
      "If we offer API access in the future, it will be subject to separate rate limits, authentication requirements, and usage terms published in our API documentation.",
    ],
  },
  {
    id: "social-integrations",
    heading: "Social Platform Integrations",
    content: [
      "Connecting third-party accounts (social or ad platforms) is subject to that platform's own terms in addition to ours. We aren't responsible for changes those platforms make to their APIs or policies.",
    ],
  },
  {
    id: "advertising-integrations",
    heading: "Advertising Integrations",
    content: [
      "Ad campaign management features will let you connect ad accounts (e.g., TikTok Ads, Snapchat Ads, X Ads, Google Ads). You remain responsible for your ad spend, compliance with platform advertising policies, and campaign content.",
    ],
  },
  {
    id: "prohibited-activities",
    heading: "Prohibited Activities",
    content: [
      {
        list: [
          "Violating any applicable law or regulation",
          "Infringing intellectual property or privacy rights of others",
          "Uploading malicious code or attempting to compromise site security",
          "Impersonating any person or entity",
          "Using the service to generate or distribute unlawful, deceptive, or harmful content",
        ],
      },
    ],
  },
  {
    id: "limitation-of-liability",
    heading: "Limitation of Liability",
    content: [
      "To the maximum extent permitted by law, MarketLoopAI will not be liable for indirect, incidental, special, or consequential damages arising from your use of the site or services.",
    ],
  },
  {
    id: "disclaimer-of-warranties",
    heading: "Disclaimer of Warranties",
    content: [
      "The site and services are provided \"as is\" and \"as available\" without warranties of any kind, express or implied, including fitness for a particular purpose or non-infringement.",
    ],
  },
  {
    id: "indemnification",
    heading: "Indemnification",
    content: [
      "You agree to indemnify and hold MarketLoopAI harmless from claims arising out of your misuse of the site or services or violation of these Terms.",
    ],
  },
  {
    id: "account-suspension",
    heading: "Account Suspension",
    content: [
      "We may suspend access to your account if we reasonably believe you've violated these Terms, pending investigation or resolution.",
    ],
  },
  {
    id: "account-termination",
    heading: "Account Termination",
    content: [
      "We may terminate or restrict your access to the site or services at our discretion, including for violations of these Terms. You may stop using the service and request account deletion at any time.",
    ],
  },
  {
    id: "governing-law",
    heading: "Governing Law",
    content: [
      "These Terms are governed by applicable law in our jurisdiction of incorporation, without regard to conflict-of-law principles, except where local law requires otherwise.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to the Terms",
    content: [
      "We may update these Terms from time to time. Continued use of the site after changes take effect constitutes acceptance of the revised Terms.",
    ],
  },
  {
    id: "contact",
    heading: "Contact Information",
    content: ["Questions about these Terms can be sent to legal@marketloopai.com."],
  },
];

function buildSections(content: SiteContentMap): LegalSection[] {
  return RAW_SECTIONS.map((section) => {
    const headingKey = `terms.section.${section.id}.heading`;
    return {
      id: section.id,
      heading: getText(content, headingKey, section.heading),
      headingKey,
      content: section.content.map((block, i) => {
        if (typeof block === "string") {
          const key = `terms.section.${section.id}.body.${i}`;
          return { text: getText(content, key, block), key };
        }
        return {
          list: block.list.map((item, j) => {
            const key = `terms.section.${section.id}.list.${i}.${j}`;
            return { text: getText(content, key, item), key };
          }),
        };
      }),
    };
  });
}

export default async function TermsPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "terms.pagehero.eyebrow", "Legal")}
      eyebrowKey="terms.pagehero.eyebrow"
      title={getText(content, "terms.pagehero.title", "Terms of Service")}
      titleKey="terms.pagehero.title"
      lastUpdated="July 20, 2026"
      sections={buildSections(content)}
    />
  );
}

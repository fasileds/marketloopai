import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { getSiteContent, getText, type SiteContentMap } from "@/lib/content/get-site-content";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How MarketLoopAI uses cookies and similar technologies.",
};

const RAW_SECTIONS: {
  id: string;
  heading: string;
  content: (string | { list: string[] })[];
}[] = [
  {
    id: "what-are-cookies",
    heading: "What Cookies Are",
    content: [
      "Cookies are small text files placed on your device when you visit a website. They help sites remember information about your visit, such as preferences and session state.",
    ],
  },
  {
    id: "types-of-cookies",
    heading: "Types of Cookies Used",
    content: [
      "We use four categories of cookies, which you can control via the cookie consent banner: Essential, Analytics, Marketing, and Preference (Functional).",
    ],
  },
  {
    id: "essential-cookies",
    heading: "Essential Cookies",
    content: [
      "Required for the site to function, such as remembering your cookie preferences and maintaining basic security. These can't be disabled.",
    ],
  },
  {
    id: "analytics-cookies",
    heading: "Analytics Cookies",
    content: [
      "Help us understand how visitors use our site (pages viewed, time on site, referral source) so we can improve it. Only set with your consent.",
    ],
  },
  {
    id: "marketing-cookies",
    heading: "Marketing Cookies",
    content: [
      "Used to measure the effectiveness of our marketing and, in the future, to personalize content or ads. Only set with your consent.",
    ],
  },
  {
    id: "preference-cookies",
    heading: "Preference Cookies",
    content: [
      "Remember choices you make (such as theme preference) to provide a more personalized experience.",
    ],
  },
  {
    id: "third-party-cookies",
    heading: "Third-Party Cookies",
    content: [
      "Some cookies may be set by third-party services we use, such as analytics providers. These are governed by the respective third party's own privacy and cookie practices.",
    ],
  },
  {
    id: "managing-cookies",
    heading: "Managing Cookies",
    content: [
      "You can update your cookie preferences at any time via the cookie banner on our site. Your choice is remembered in your browser's local storage.",
    ],
  },
  {
    id: "browser-settings",
    heading: "Browser Settings",
    content: [
      "Most browsers let you block or delete cookies through their settings. Note that blocking essential cookies may affect site functionality.",
    ],
  },
  {
    id: "contact",
    heading: "Contact Information",
    content: ["Questions about this Cookie Policy can be sent to privacy@marketloopai.com."],
  },
];

function buildSections(content: SiteContentMap): LegalSection[] {
  return RAW_SECTIONS.map((section) => {
    const headingKey = `cookies.section.${section.id}.heading`;
    return {
      id: section.id,
      heading: getText(content, headingKey, section.heading),
      headingKey,
      content: section.content.map((block, i) => {
        if (typeof block === "string") {
          const key = `cookies.section.${section.id}.body.${i}`;
          return { text: getText(content, key, block), key };
        }
        return {
          list: block.list.map((item, j) => {
            const key = `cookies.section.${section.id}.list.${i}.${j}`;
            return { text: getText(content, key, item), key };
          }),
        };
      }),
    };
  });
}

export default async function CookiesPage() {
  const content = await getSiteContent();

  return (
    <LegalPage
      eyebrow={getText(content, "cookies.pagehero.eyebrow", "Legal")}
      eyebrowKey="cookies.pagehero.eyebrow"
      title={getText(content, "cookies.pagehero.title", "Cookie Policy")}
      titleKey="cookies.pagehero.title"
      lastUpdated="July 20, 2026"
      sections={buildSections(content)}
    />
  );
}

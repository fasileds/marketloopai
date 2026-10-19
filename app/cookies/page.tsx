import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/legal/legal-page";
import { getSiteContent, getText, type SiteContentMap } from "@/lib/content/get-site-content";
import { LEGAL_LAST_UPDATED } from "@/lib/legal/constants";

const DESCRIPTION =
  "How MarketLoopAI uses cookies and similar technologies on the marketing site and in the SaaS application, including authentication, analytics, and connected-platform features.";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: DESCRIPTION,
  alternates: { canonical: "/cookies" },
  openGraph: {
    title: "Cookie Policy",
    description: DESCRIPTION,
    url: "/cookies",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy",
    description: DESCRIPTION,
  },
};

const RAW_SECTIONS: {
  id: string;
  heading: string;
  content: (string | { list: string[] })[];
}[] = [
  {
    id: "scope",
    heading: "1. Scope",
    content: [
      "This Cookie Policy explains how MarketLoopAI uses cookies and similar technologies (local storage, session storage, pixels, and SDKs) on marketloopai.com and in the MarketLoopAI application (together, the \"Service\").",
      "It applies to visitors, waitlist signups, account holders, and organization members. It should be read with our Privacy Policy and Terms of Service. In the EEA and UK, non-essential cookies are set only with consent under the ePrivacy Directive / PECR, except where an exemption applies.",
    ],
  },
  {
    id: "what-cookies",
    heading: "2. What cookies and similar technologies are",
    content: [
      "Cookies are small text files stored on your device. Similar technologies store or read identifiers in the browser or app so we can keep you signed in, remember preferences, measure usage, and (with consent where required) support marketing.",
    ],
  },
  {
    id: "categories",
    heading: "3. Categories we use",
    content: [
      "We group cookies into Essential, Analytics, Marketing, and Preference (Functional). You can control non-essential categories in the cookie banner. Your choice is stored in your browser (typically local storage) so we can honor it on later visits from that device.",
    ],
  },
  {
    id: "essential",
    heading: "4. Essential cookies",
    content: [
      "These are required to operate the Service securely. They cannot be switched off in the banner. They include:",
      {
        list: [
          "Cookie-consent record so we know which categories you allowed",
          "Authentication and session cookies (for example Supabase Auth) so you stay signed in",
          "Security, CSRF, and load-balancing cookies",
          "Temporary state needed to complete Google sign-in, magic-link login, or a payment return from Stripe",
        ],
      },
      "Blocking essential cookies in your browser may prevent sign-in, billing, or job submission.",
    ],
  },
  {
    id: "analytics",
    heading: "5. Analytics cookies",
    content: [
      "With consent where required, we use analytics cookies and similar tools to understand how the marketing site and the application are used: pages and features viewed, referral source, approximate location from IP, device type, and performance or error events.",
      "In the application this can include product-analytics events such as generation jobs started, campaign screens opened, or settings changed. We use this to operate, debug, and improve the Service — not to sell your Customer Content.",
    ],
  },
  {
    id: "marketing",
    heading: "6. Marketing cookies",
    content: [
      "With consent where required, marketing cookies help us measure campaigns that promote MarketLoopAI (for example a paid ad that brought you to the site) and may support remarketing of our own product.",
      "These cookies are about how we market MarketLoopAI. They are separate from the ad accounts you connect inside the product. Connecting Meta, Google, TikTok, Snapchat, X, or similar platforms uses OAuth and APIs under those providers' terms; that is not the same as our marketing cookies.",
    ],
  },
  {
    id: "preferences",
    heading: "7. Preference cookies",
    content: [
      "Preference (functional) cookies remember choices such as theme, locale, dismissed notices, or last-used workspace so the Service feels consistent. Some preference storage is local to your browser and is not sent to us.",
    ],
  },
  {
    id: "third-parties",
    heading: "8. Third parties",
    content: [
      "Cookies or similar storage may be set by processors and platforms we use, including:",
      {
        list: [
          "Hosting and edge (for example Vercel)",
          "Authentication, database, and storage (for example Supabase)",
          "Payments (Stripe) when you open checkout or the billing portal",
          "Email delivery (for example Resend) does not typically set browser cookies, but links in email may include tracking parameters",
          "Identity providers such as Google if you choose \"Continue with Google\"",
          "Social and advertising platforms you connect, which may set their own cookies when you complete OAuth or open their consoles from our app",
        ],
      },
      "Those parties have their own privacy and cookie policies. We only load non-essential third-party marketing or analytics tags after you consent, where the banner applies.",
    ],
  },
  {
    id: "duration",
    heading: "9. Duration",
    content: [
      "Session cookies expire when you close the browser. Persistent cookies last for a set period (from days to up to about 13 months for analytics/marketing, unless a provider uses a different default) or until you delete them. Auth sessions may last until you sign out or the session expires.",
    ],
  },
  {
    id: "managing",
    heading: "10. How to manage cookies",
    content: [
      "Use the cookie banner to accept all, reject non-essential, or save custom preferences. You can also clear site data or block cookies in your browser. Do not block essential cookies if you need to use the application. Where required, we honor Global Privacy Control (GPC) as an opt-out of sale or sharing for our marketing cookies on that browser, as described in the Privacy Policy.",
      "If you use multiple browsers or devices, set preferences on each. Signing out does not by itself delete analytics cookies.",
    ],
  },
  {
    id: "changes",
    heading: "11. Changes",
    content: [
      "We may update this Cookie Policy when our practices or providers change. The \"Last updated\" date will be revised. Material changes may be highlighted in the banner or by other notice.",
    ],
  },
  {
    id: "contact",
    heading: "12. Contact",
    content: [
      "Questions about cookies or privacy: privacy@marketloopai.com. The full legal suite is at marketloopai.com/legal.",
    ],
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
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={buildSections(content)}
    />
  );
}

import type { Metadata } from "next";

import { ExploreLinks, type ExploreItem } from "@/components/sections/explore-links";
import { Faq, type FaqItem } from "@/components/sections/faq";
import { Hero, type HeroStat } from "@/components/sections/hero";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { Testimonials } from "@/components/sections/testimonials";
import { TikTokShowcase } from "@/components/sections/tiktok-showcase";
import { WaitlistCta } from "@/components/sections/waitlist-cta";
import { Workflow } from "@/components/sections/workflow";
import { getSiteContent, getText } from "@/lib/content/get-site-content";
import { getPublishedTikTokVideos } from "@/lib/tiktok/get-videos";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marketloopai.com";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: SITE_URL,
  },
};

const DEFAULT_HERO_STATS: HeroStat[] = [
  { value: "Up to 9", label: "Variations generated per post" },
  { value: "6+", label: "Content & ad platforms supported" },
  { value: "1", label: "Idea needed to start" },
];

const DEFAULT_EXPLORE_ITEMS: ExploreItem[] = [
  {
    title: "Features",
    description: "AI content repurposing, humanization, ranking, and video ad generation.",
  },
  {
    title: "Solutions",
    description: "Built for e-commerce brands, SaaS startups, agencies, and personal brands.",
  },
  { title: "Integrations", description: "TikTok, Snapchat, X, Facebook, Instagram, LinkedIn, and Google Ads." },
];

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    question: "How is this different from a generic AI writing tool?",
    answer:
      "Instead of generating one piece of content and showing it to you right away, MarketLoopAI generates multiple variations, scores each one for how natural and human it feels, and shows you the strongest version first — while still giving you access to every other variation.",
  },
  {
    question: "What platforms can I create content for?",
    answer:
      "Content generation and repurposing currently target LinkedIn, TikTok, Snapchat, X, Facebook, and Instagram, with more channels planned. Advertising workflows connect to TikTok Ads, Snapchat Ads, X Ads, Google Ads, and Facebook/Meta Ads.",
  },
  {
    question: "Can it generate a full video ad, or just a script?",
    answer:
      "Both, depending on the platform and campaign. Where AI video generation is supported and authorized, MarketLoopAI can prepare a video ad up to about three minutes. If you'd rather produce it yourself, you get a detailed scene-by-scene storyboard — visual direction, on-screen text, voiceover, and calls-to-action.",
  },
  {
    question: "Do I need design or video experience to use it?",
    answer:
      "No. MarketLoopAI produces ready-to-use content and creative direction — you review, edit if you'd like, and publish.",
  },
  {
    question: "How does the referral program work?",
    answer:
      "Every waitlist signup gets a unique referral code. Share it and you'll move up the list as more people join through your link.",
  },
];

export default async function Home() {
  const content = await getSiteContent();
  const tiktokVideos = await getPublishedTikTokVideos(4);

  const heroStats: HeroStat[] = DEFAULT_HERO_STATS.map((stat, index) => ({
    value: getText(content, `home.hero.stats.${index}.value`, stat.value),
    label: getText(content, `home.hero.stats.${index}.label`, stat.label),
  }));

  const exploreItems: ExploreItem[] = DEFAULT_EXPLORE_ITEMS.map((item, index) => ({
    title: getText(content, `home.explore.items.${index}.title`, item.title),
    description: getText(content, `home.explore.items.${index}.description`, item.description),
  }));

  const faqItems: FaqItem[] = DEFAULT_FAQ_ITEMS.map((item, index) => ({
    question: getText(content, `home.faq.items.${index}.question`, item.question),
    answer: getText(content, `home.faq.items.${index}.answer`, item.answer),
  }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-script-in-head-component -- structured data, not a runtime script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Hero
        eyebrow={getText(content, "home.hero.eyebrow")}
        headlinePrefix={getText(content, "home.hero.headline_prefix")}
        headlineHighlight={getText(content, "home.hero.headline_highlight")}
        subheadline={getText(content, "home.hero.subheadline")}
        ctaPrimary={getText(content, "home.hero.cta_primary")}
        ctaSecondary={getText(content, "home.hero.cta_secondary")}
        stats={heroStats}
      />
      <ExploreLinks items={exploreItems} />
      <ProductShowcase
        eyebrow={getText(content, "home.product.eyebrow", "Product")}
        titlePrefix={getText(content, "home.product.title_prefix", "Every variation,")}
        titleHighlight={getText(content, "home.product.title_highlight", "ranked and ready")}
        description={getText(
          content,
          "home.product.description",
          "Review every generated variation, see how it's ranked, and manage your campaigns from one place.",
        )}
      />
      <Workflow
        eyebrow={getText(content, "home.workflow.eyebrow")}
        heading={getText(content, "home.workflow.heading")}
        description={getText(content, "home.workflow.description")}
      />
      <TikTokShowcase videos={tiktokVideos} />
      <Testimonials />
      <Faq heading={getText(content, "home.faq.heading")} items={faqItems} />
      <WaitlistCta
        heading={getText(content, "home.waitlist_cta.heading")}
        description={getText(content, "home.waitlist_cta.description")}
        formCopy={{
          nameLabel: getText(content, "waitlistform.label.name", "Full name"),
          emailLabel: getText(content, "waitlistform.label.email", "Work email"),
          companyLabel: getText(content, "waitlistform.label.company", "Company (optional)"),
          websiteLabel: getText(content, "waitlistform.label.website", "Website (optional)"),
          submitLabel: getText(content, "waitlistform.submit.label", "Join Waitlist"),
          disclaimer: getText(
            content,
            "waitlistform.disclaimer",
            "No spam. We'll email you about early access and product updates.",
          ),
          successHeading: getText(content, "waitlistform.success.heading", "You're on the list"),
          successSubheading: getText(
            content,
            "waitlistform.success.subheading",
            "Share your referral code to move up the list:",
          ),
        }}
      />
    </>
  );
}

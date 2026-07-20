import { ExploreLinks, type ExploreItem } from "@/components/sections/explore-links";
import { Faq, type FaqItem } from "@/components/sections/faq";
import { Hero, type HeroStat } from "@/components/sections/hero";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { Testimonials } from "@/components/sections/testimonials";
import { WaitlistCta } from "@/components/sections/waitlist-cta";
import { Workflow } from "@/components/sections/workflow";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

const DEFAULT_HERO_STATS: HeroStat[] = [
  { value: "10x", label: "Faster content production" },
  { value: "40+", label: "Channels & ad platforms" },
  { value: "24/7", label: "AI-powered publishing" },
];

const DEFAULT_EXPLORE_ITEMS: ExploreItem[] = [
  { title: "Features", description: "AI content, video, publishing, and ad campaign management." },
  { title: "Solutions", description: "Built for Shopify stores, SaaS, personal brands, and agencies." },
  { title: "Integrations", description: "TikTok, Instagram, Google Ads, Shopify, and more." },
];

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    question: "When does MarketLoopAI launch?",
    answer:
      "We're in active development. Joining the waitlist is the best way to get early access and updates as we get closer to launch.",
  },
  {
    question: "What platforms can I publish and advertise on?",
    answer:
      "TikTok, Instagram, LinkedIn, X, Facebook, YouTube, and ad platforms including TikTok Ads, Snapchat Ads, X Ads, and Google Ads, with more integrations planned.",
  },
  {
    question: "Do I need any design or video editing experience?",
    answer:
      "No. MarketLoopAI generates on-brand content, video, and ad creative for you — you review and publish.",
  },
  {
    question: "Can my whole team use it?",
    answer:
      "Yes. Team collaboration, shared workspaces, and approval workflows are built in from day one.",
  },
  {
    question: "How does the referral program work?",
    answer:
      "Every waitlist signup gets a unique referral code. Share it and you'll move up the list as more people join through your link.",
  },
];

export default async function Home() {
  const content = await getSiteContent();

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

  return (
    <>
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
        titlePrefix={getText(content, "home.product.title_prefix", "One dashboard,")}
        titleHighlight={getText(content, "home.product.title_highlight", "every screen")}
        description={getText(
          content,
          "home.product.description",
          "Review campaigns, approve content, and check performance from wherever you work.",
        )}
      />
      <Workflow
        eyebrow={getText(content, "home.workflow.eyebrow")}
        heading={getText(content, "home.workflow.heading")}
        description={getText(content, "home.workflow.description")}
      />
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
            "No spam. We'll only email you about your early access.",
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

export type ContentFieldType = "text" | "textarea" | "json";

export type ContentField = {
  key: string;
  group: string;
  label: string;
  type: ContentFieldType;
  default: string;
};

function field(
  group: string,
  key: string,
  label: string,
  type: ContentFieldType,
  defaultValue: string,
): ContentField {
  return { key, group, label, type, default: defaultValue };
}

function json(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export const CONTENT_FIELDS: ContentField[] = [
  // Brand / navbar / footer
  field("Brand", "brand.name", "Site name", "text", "MarketLoopAI"),
  field(
    "Brand",
    "footer.tagline",
    "Footer tagline",
    "textarea",
    "Turn one idea into humanized, platform-ready content and advertising creative — for LinkedIn, TikTok, Snapchat, X, Facebook, Instagram, and more.",
  ),
  field(
    "Brand",
    "footer.copyright",
    "Footer copyright line",
    "text",
    "MarketLoopAI. All rights reserved.",
  ),

  // Home — hero
  field(
    "Home / Hero",
    "home.hero.eyebrow",
    "Eyebrow badge text",
    "text",
    "AI content, humanized and ranked before you ever see it",
  ),
  field("Home / Hero", "home.hero.headline_prefix", "Headline (first part)", "text", "One Idea In."),
  field(
    "Home / Hero",
    "home.hero.headline_highlight",
    "Headline (highlighted part)",
    "textarea",
    "Content and Ad Creative Out.",
  ),
  field(
    "Home / Hero",
    "home.hero.subheadline",
    "Subheadline",
    "textarea",
    "Give MarketLoopAI a sentence, a prompt, or something you've already written. It generates multiple platform-ready variations, scores each one for how natural and human it feels, and hands you the strongest version first — for LinkedIn, TikTok, Snapchat, X, Facebook, Instagram, and your ad campaigns.",
  ),
  field("Home / Hero", "home.hero.cta_primary", "Primary button label", "text", "Join Waitlist"),
  field("Home / Hero", "home.hero.cta_secondary", "Secondary button label", "text", "See How It Works"),
  field(
    "Home / Hero",
    "home.hero.stats",
    "Stats row (JSON array of {value, label})",
    "json",
    json([
      { value: "Up to 9", label: "Variations generated per post" },
      { value: "6+", label: "Content & ad platforms supported" },
      { value: "1", label: "Idea needed to start" },
    ]),
  ),

  // Home — explore links
  field(
    "Home / Explore",
    "home.explore.items",
    "Explore cards (JSON array of {title, description})",
    "json",
    json([
      {
        title: "Features",
        description: "AI content repurposing, humanization, ranking, and video ad generation.",
      },
      {
        title: "Solutions",
        description: "Built for e-commerce brands, SaaS startups, agencies, and personal brands.",
      },
      { title: "Integrations", description: "TikTok, Snapchat, X, Facebook, Instagram, LinkedIn, and Google Ads." },
    ]),
  ),

  // Home — workflow
  field("Home / Workflow", "home.workflow.eyebrow", "Eyebrow", "text", "How it works"),
  field(
    "Home / Workflow",
    "home.workflow.heading",
    "Heading",
    "text",
    "From one idea to ranked, platform-ready content",
  ),
  field(
    "Home / Workflow",
    "home.workflow.description",
    "Description",
    "textarea",
    "A structured pipeline that generates, humanizes, ranks, and adapts your content before it ever reaches you.",
  ),
  field(
    "Home / Workflow",
    "home.workflow.steps",
    "Steps (JSON array of {title, description})",
    "json",
    json([
      {
        title: "Give us your idea",
        description: "Start with a sentence, a prompt, a product description, or content you already have.",
      },
      {
        title: "Generate multiple variations",
        description: "MarketLoopAI generates several distinct versions of your content — up to nine per post.",
      },
      {
        title: "Humanize & evaluate",
        description: "Every version is scored for how natural, authentic, and human it feels, not just grammar.",
      },
      {
        title: "Rank the best content",
        description: "Versions are ranked by humanization and quality score, so the strongest one surfaces first.",
      },
      {
        title: "Adapt for every platform",
        description:
          "The winning version is reshaped for LinkedIn, TikTok, Snapchat, X, Facebook, and Instagram — in each platform's own style.",
      },
      {
        title: "Create video or scene plans",
        description:
          "Generate a full AI video ad where supported, or get a scene-by-scene storyboard your team can shoot.",
      },
      {
        title: "Launch and manage campaigns",
        description:
          "Organize your ad campaigns across TikTok Ads, Snapchat Ads, X Ads, Google Ads, and Facebook/Meta Ads.",
      },
    ]),
  ),

  // Home — FAQ
  field("Home / FAQ", "home.faq.heading", "Heading", "text", "Frequently asked questions"),
  field(
    "Home / FAQ",
    "home.faq.items",
    "Questions (JSON array of {question, answer})",
    "json",
    json([
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
    ]),
  ),

  // Home — final waitlist CTA
  field(
    "Home / Waitlist CTA",
    "home.waitlist_cta.heading",
    "Heading",
    "text",
    "Be first to turn one idea into content across every platform",
  ),
  field(
    "Home / Waitlist CTA",
    "home.waitlist_cta.description",
    "Description",
    "textarea",
    "Join the waitlist for early access to AI content repurposing, humanization, ranking, and multi-platform ad management.",
  ),

  // Page hero banners (About / Pricing / Features / Solutions / Integrations / Blog / Contact)
  field("About page", "pagehero.about.eyebrow", "Eyebrow", "text", "About us"),
  field(
    "About page",
    "pagehero.about.title",
    "Title",
    "text",
    "We're building the content team every business deserves",
  ),
  field(
    "About page",
    "pagehero.about.description",
    "Description",
    "textarea",
    "MarketLoopAI exists because turning one idea into great content for six different platforms shouldn't take six different tools — or a full content team.",
  ),

  field("Pricing page", "pagehero.pricing.eyebrow", "Eyebrow", "text", "Pricing"),
  field(
    "Pricing page",
    "pagehero.pricing.title",
    "Title",
    "text",
    "Simple pricing, built to scale with your content",
  ),
  field(
    "Pricing page",
    "pagehero.pricing.description",
    "Description",
    "textarea",
    "Start free, upgrade as you generate more content, more variations, and manage more ad campaigns.",
  ),

  field("Features page", "pagehero.features.eyebrow", "Eyebrow", "text", "Features"),
  field(
    "Features page",
    "pagehero.features.title",
    "Title",
    "text",
    "From one idea to ranked, platform-ready content and ad creative",
  ),
  field(
    "Features page",
    "pagehero.features.description",
    "Description",
    "textarea",
    "AI content repurposing, humanization and ranking, video ad generation, and multi-platform ad management — all in one workflow.",
  ),

  field("Solutions page", "pagehero.solutions.eyebrow", "Eyebrow", "text", "Solutions"),
  field("Solutions page", "pagehero.solutions.title", "Title", "text", "Built for how you create and sell"),
  field(
    "Solutions page",
    "pagehero.solutions.description",
    "Description",
    "textarea",
    "Whether you're an e-commerce brand, a SaaS startup, an agency, or a personal brand, MarketLoopAI adapts your ideas to your audience.",
  ),

  field("Integrations page", "pagehero.integrations.eyebrow", "Eyebrow", "text", "Integrations"),
  field(
    "Integrations page",
    "pagehero.integrations.title",
    "Title",
    "text",
    "Connects to the platforms your audience is already on",
  ),
  field(
    "Integrations page",
    "pagehero.integrations.description",
    "Description",
    "textarea",
    "Generate and repurpose content for LinkedIn, TikTok, Snapchat, X, Facebook, and Instagram, and manage ad campaigns across supported advertising platforms.",
  ),

  field("Contact page", "pagehero.contact.eyebrow", "Eyebrow", "text", "Contact"),
  field("Contact page", "pagehero.contact.title", "Title", "text", "Let's talk about your content and campaigns"),
  field(
    "Contact page",
    "pagehero.contact.description",
    "Description",
    "textarea",
    "Questions about the waitlist, partnerships, or press? We'd love to hear from you.",
  ),
];

export const CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  CONTENT_FIELDS.map((f) => [f.key, f.default]),
);

export const CONTENT_GROUPS: string[] = Array.from(new Set(CONTENT_FIELDS.map((f) => f.group)));

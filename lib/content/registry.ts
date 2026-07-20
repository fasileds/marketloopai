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
    "Turn your website into content, videos, and high-performing ad campaigns — from one intelligent platform.",
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
    "Now building the future of AI marketing",
  ),
  field("Home / Hero", "home.hero.headline_prefix", "Headline (first part)", "text", "Turn Your Website Into"),
  field(
    "Home / Hero",
    "home.hero.headline_highlight",
    "Headline (highlighted part)",
    "textarea",
    "Content, Videos, and High-Performing Ad Campaigns",
  ),
  field(
    "Home / Hero",
    "home.hero.subheadline",
    "Subheadline",
    "textarea",
    "Generate AI content, create product videos, publish everywhere, and launch ad campaigns from one intelligent platform.",
  ),
  field("Home / Hero", "home.hero.cta_primary", "Primary button label", "text", "Join Waitlist"),
  field("Home / Hero", "home.hero.cta_secondary", "Secondary button label", "text", "Watch Demo"),
  field(
    "Home / Hero",
    "home.hero.stats",
    "Stats row (JSON array of {value, label})",
    "json",
    json([
      { value: "10x", label: "Faster content production" },
      { value: "40+", label: "Channels & ad platforms" },
      { value: "24/7", label: "AI-powered publishing" },
    ]),
  ),

  // Home — explore links
  field(
    "Home / Explore",
    "home.explore.items",
    "Explore cards (JSON array of {title, description})",
    "json",
    json([
      { title: "Features", description: "AI content, video, publishing, and ad campaign management." },
      { title: "Solutions", description: "Built for Shopify stores, SaaS, personal brands, and agencies." },
      { title: "Integrations", description: "TikTok, Instagram, Google Ads, Shopify, and more." },
    ]),
  ),

  // Home — workflow
  field("Home / Workflow", "home.workflow.eyebrow", "Eyebrow", "text", "Workflow"),
  field(
    "Home / Workflow",
    "home.workflow.heading",
    "Heading",
    "text",
    "From website to optimized campaign",
  ),
  field(
    "Home / Workflow",
    "home.workflow.description",
    "Description",
    "textarea",
    "A fully automated loop that keeps improving the longer you use it.",
  ),
  field(
    "Home / Workflow",
    "home.workflow.steps",
    "Steps (JSON array of {title, description})",
    "json",
    json([
      { title: "Website", description: "Connect your site as the source of truth." },
      { title: "AI Analysis", description: "We learn your brand voice, offers, and audience." },
      { title: "Generate", description: "Posts, videos, and ad creative generated automatically." },
      { title: "Publish", description: "Pushed to every channel, formatted and scheduled." },
      { title: "Launch Ads", description: "Campaigns go live across TikTok, Snap, X, Google." },
      { title: "Analytics", description: "Unified performance data as it comes in." },
      { title: "Optimize", description: "AI reallocates spend toward what's working." },
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
        answer: "Yes. Team collaboration, shared workspaces, and approval workflows are built in from day one.",
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
    "Be first to experience the future of AI marketing",
  ),
  field(
    "Home / Waitlist CTA",
    "home.waitlist_cta.description",
    "Description",
    "textarea",
    "Join the waitlist for early access, launch pricing, and a front-row seat as we build.",
  ),

  // Page hero banners (About / Pricing / Features / Solutions / Integrations / Blog / Contact)
  field("About page", "pagehero.about.eyebrow", "Eyebrow", "text", "About us"),
  field(
    "About page",
    "pagehero.about.title",
    "Title",
    "text",
    "We're building the marketing team every business deserves",
  ),
  field(
    "About page",
    "pagehero.about.description",
    "Description",
    "textarea",
    "MarketLoopAI exists because great marketing shouldn't require a dozen tools, a big budget, or a full-time team.",
  ),

  field("Pricing page", "pagehero.pricing.eyebrow", "Eyebrow", "text", "Pricing"),
  field("Pricing page", "pagehero.pricing.title", "Title", "text", "Simple pricing, built to scale with you"),
  field(
    "Pricing page",
    "pagehero.pricing.description",
    "Description",
    "textarea",
    "Start free, upgrade as your content and ad spend grow. No hidden fees.",
  ),

  field("Features page", "pagehero.features.eyebrow", "Eyebrow", "text", "Features"),
  field(
    "Features page",
    "pagehero.features.title",
    "Title",
    "text",
    "Everything your marketing team needs, in one platform",
  ),
  field(
    "Features page",
    "pagehero.features.description",
    "Description",
    "textarea",
    "Stop stitching together a dozen tools. MarketLoopAI replaces your content, video, publishing, and ad stack.",
  ),

  field("Solutions page", "pagehero.solutions.eyebrow", "Eyebrow", "text", "Solutions"),
  field("Solutions page", "pagehero.solutions.title", "Title", "text", "Built for how you sell"),
  field(
    "Solutions page",
    "pagehero.solutions.description",
    "Description",
    "textarea",
    "Whatever kind of business you run, MarketLoopAI adapts to your workflow.",
  ),

  field("Integrations page", "pagehero.integrations.eyebrow", "Eyebrow", "text", "Integrations"),
  field(
    "Integrations page",
    "pagehero.integrations.title",
    "Title",
    "text",
    "Connects to everywhere you already work",
  ),
  field(
    "Integrations page",
    "pagehero.integrations.description",
    "Description",
    "textarea",
    "Publish content and launch ads directly on the platforms your audience lives on.",
  ),

  field("Contact page", "pagehero.contact.eyebrow", "Eyebrow", "text", "Contact"),
  field("Contact page", "pagehero.contact.title", "Title", "text", "Let's talk about your marketing"),
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

import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

import { RoadmapContent } from "./roadmap-content";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "What we're building next at MarketLoopAI, and what's already shipped.",
};

const ROADMAP_ITEMS = [
  {
    id: "waitlist",
    title: "Waitlist & referral program",
    description: "Join early, refer others, move up the list.",
    status: "completed" as const,
  },
  {
    id: "marketing-site",
    title: "Marketing site",
    description: "Features, solutions, pricing, and integrations pages.",
    status: "completed" as const,
  },
  {
    id: "ai-content",
    title: "AI content generation",
    description: "Turn a website or prompt into on-brand articles and captions.",
    status: "in-progress" as const,
  },
  {
    id: "ai-video",
    title: "AI video generation",
    description: "Produce product and social videos without a camera crew.",
    status: "in-progress" as const,
  },
  {
    id: "publishing",
    title: "Multi-channel publishing",
    description: "Schedule and publish to TikTok, Instagram, LinkedIn, X, and more.",
    status: "in-progress" as const,
  },
  {
    id: "ad-campaigns",
    title: "Ad campaign management",
    description: "Launch and manage TikTok Ads, Snapchat Ads, X Ads, and Google Ads.",
    status: "planned" as const,
  },
  {
    id: "analytics",
    title: "Unified analytics dashboard",
    description: "See performance across every channel in one place.",
    status: "planned" as const,
  },
  {
    id: "team-collab",
    title: "Team collaboration",
    description: "Shared workspaces, approvals, and role-based access.",
    status: "planned" as const,
  },
  {
    id: "agency-workspaces",
    title: "Agency multi-client workspaces",
    description: "Manage multiple client brands from a single seat.",
    status: "planned" as const,
  },
];

const STATUS_LABELS = {
  planned: "Planned",
  "in-progress": "In Progress",
  completed: "Completed",
} as const;

export default async function RoadmapPage() {
  const content = await getSiteContent();

  const items = ROADMAP_ITEMS.map((item) => ({
    id: item.id,
    status: item.status,
    title: getText(content, `roadmap.items.${item.id}.title`, item.title),
    titleKey: `roadmap.items.${item.id}.title`,
    description: getText(content, `roadmap.items.${item.id}.description`, item.description),
    descriptionKey: `roadmap.items.${item.id}.description`,
  }));

  const statusLabels = {
    planned: {
      label: getText(content, "roadmap.status.planned.label", STATUS_LABELS.planned),
      key: "roadmap.status.planned.label",
    },
    "in-progress": {
      label: getText(content, "roadmap.status.in-progress.label", STATUS_LABELS["in-progress"]),
      key: "roadmap.status.in-progress.label",
    },
    completed: {
      label: getText(content, "roadmap.status.completed.label", STATUS_LABELS.completed),
      key: "roadmap.status.completed.label",
    },
  };

  return (
    <>
      <PageHero
        eyebrow={getText(content, "pagehero.roadmap.eyebrow", "Roadmap")}
        eyebrowKey="pagehero.roadmap.eyebrow"
        title={getText(content, "pagehero.roadmap.title", "What we're building, in the open")}
        titleKey="pagehero.roadmap.title"
        description={getText(
          content,
          "pagehero.roadmap.description",
          "Vote on what matters most to you — it helps us prioritize. Votes are stored in your browser, not tied to an account yet.",
        )}
        descriptionKey="pagehero.roadmap.description"
      />
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <RoadmapContent items={items} statusLabels={statusLabels} />
      </section>
    </>
  );
}

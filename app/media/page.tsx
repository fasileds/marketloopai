import type { Metadata } from "next";
import { Megaphone, MonitorPlay, Rss, Sparkles } from "lucide-react";

import { EditableText } from "@/components/editing/editable-text";
import { PageHero } from "@/components/layout/page-hero";
import { WaitlistCtaBand } from "@/components/sections/waitlist-cta-band";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

export const metadata: Metadata = {
  title: "Media Center",
  description:
    "Product demos, tutorials, and announcements from MarketLoopAI — launching alongside the product.",
};

const CATEGORIES = [
  {
    title: "Product Demos",
    description: "Walkthroughs of AI content, video generation, and publishing in action.",
    icon: MonitorPlay,
  },
  {
    title: "Tutorials",
    description: "Step-by-step guides for getting the most out of MarketLoopAI.",
    icon: Sparkles,
  },
  {
    title: "Announcements",
    description: "New features, launch milestones, and roadmap updates.",
    icon: Megaphone,
  },
  {
    title: "Social Clips",
    description: "Short-form video from our YouTube, TikTok, and Instagram channels.",
    icon: Rss,
  },
];

export default async function MediaPage() {
  const content = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow={getText(content, "media.pagehero.eyebrow", "Media Center")}
        eyebrowKey="media.pagehero.eyebrow"
        title={getText(content, "media.pagehero.title", "Demos and updates, coming with launch")}
        titleKey="media.pagehero.title"
        description={getText(
          content,
          "media.pagehero.description",
          "Our media library — product demos, tutorials, and announcement videos — goes live alongside the product.",
        )}
        descriptionKey="media.pagehero.description"
      />

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[100rem] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category, i) => (
            <div key={category.title} className="glass relative overflow-hidden rounded-2xl p-6">
              <span className="absolute right-4 top-4 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                Coming soon
              </span>
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <category.icon className="size-5" aria-hidden />
              </div>
              <h3 className="text-base font-medium">
                <EditableText
                  contentKey={`media.categories.${i}.title`}
                  value={getText(content, `media.categories.${i}.title`, category.title)}
                />
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <EditableText
                  multiline
                  contentKey={`media.categories.${i}.description`}
                  value={getText(content, `media.categories.${i}.description`, category.description)}
                />
              </p>
            </div>
          ))}
        </div>
      </section>

      <WaitlistCtaBand
        title={getText(content, "media.cta.title", "Get notified when the media library launches")}
        titleKey="media.cta.title"
      />
    </>
  );
}

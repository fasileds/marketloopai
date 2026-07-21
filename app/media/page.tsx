import type { Metadata } from "next";
import { Megaphone, MonitorPlay, Rss, Sparkles } from "lucide-react";

import { EditableText } from "@/components/editing/editable-text";
import { PageHero } from "@/components/layout/page-hero";
import { WaitlistCtaBand } from "@/components/sections/waitlist-cta-band";
import { TikTokVideoGrid } from "@/components/media/tiktok-video-grid";
import { getSiteContent, getText } from "@/lib/content/get-site-content";
import { getPublishedTikTokVideos } from "@/lib/tiktok/get-videos";

export const metadata: Metadata = {
  title: "Media Center",
  description:
    "Product demos, feature walkthroughs, customer stories, and platform updates from MarketLoopAI — launching alongside the product.",
};

const CATEGORIES = [
  {
    title: "Product Demos",
    description: "See content repurposing, humanization, ranking, and video ad generation in action.",
    icon: MonitorPlay,
  },
  {
    title: "Feature Walkthroughs",
    description: "Step-by-step guides to getting the most out of MarketLoopAI's tools.",
    icon: Sparkles,
  },
  {
    title: "Customer Stories",
    description: "How brands, agencies, and creators use MarketLoopAI to create and advertise.",
    icon: Megaphone,
  },
  {
    title: "Platform Updates",
    description: "New features, integrations, and roadmap milestones.",
    icon: Rss,
  },
];

export default async function MediaPage() {
  const content = await getSiteContent();
  const videos = await getPublishedTikTokVideos();

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
          "Our media library — product demos, feature walkthroughs, customer stories, and platform updates — goes live alongside the product.",
        )}
        descriptionKey="media.pagehero.description"
      />

      {videos.length > 0 && (
        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[100rem]">
            <TikTokVideoGrid videos={videos} />
          </div>
        </section>
      )}

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

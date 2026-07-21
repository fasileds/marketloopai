import type { Metadata } from "next";
import { BarChart3, Clapperboard, Megaphone, Wand2 } from "lucide-react";

import { FeaturedPostCard, PostCard, type PostCardData } from "@/components/blog/post-card";
import { EditableText } from "@/components/editing/editable-text";
import { PageHero } from "@/components/layout/page-hero";
import { WaitlistCtaBand } from "@/components/sections/waitlist-cta-band";
import { getSiteContent, getText } from "@/lib/content/get-site-content";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and updates on AI content repurposing, humanization, ranking, and multi-platform ad creative — launching alongside MarketLoopAI.",
};

export const revalidate = 60;

const CATEGORIES = [
  {
    title: "AI Content Repurposing",
    description: "How to turn one idea into content variations for every platform without losing your voice.",
    icon: Wand2,
  },
  {
    title: "Humanization & Content Ranking",
    description: "Inside the judging layer that scores, ranks, and surfaces your strongest content.",
    icon: BarChart3,
  },
  {
    title: "Video Ad Creative",
    description: "Guides for turning a concept into scene-by-scene scripts and finished video ads.",
    icon: Clapperboard,
  },
  {
    title: "Multi-Platform Ad Management",
    description: "Playbooks for connecting and running campaigns across TikTok, Snapchat, X, Google, and Meta Ads.",
    icon: Megaphone,
  },
];

async function getPosts(): Promise<PostCardData[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, title, excerpt, content, category, author_name, published_at, cover_image_url")
      .eq("published", true)
      .order("published_at", { ascending: false });
    return (data as PostCardData[]) ?? [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  const content = await getSiteContent();

  if (posts.length > 0) {
    const [featured, ...rest] = posts;

    return (
      <>
        <PageHero
          eyebrow={getText(content, "blog.pagehero.withposts.eyebrow", "Blog")}
          eyebrowKey="blog.pagehero.withposts.eyebrow"
          title={getText(
            content,
            "blog.pagehero.withposts.title",
            "Guides on AI content repurposing, humanization, and ad creative",
          )}
          titleKey="blog.pagehero.withposts.title"
        />
        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[100rem]">
            <FeaturedPostCard post={featured} />

            {rest.length > 0 && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={getText(content, "blog.pagehero.empty.eyebrow", "Blog")}
        eyebrowKey="blog.pagehero.empty.eyebrow"
        title={getText(content, "blog.pagehero.empty.title", "The MarketLoopAI blog is coming soon")}
        titleKey="blog.pagehero.empty.title"
        description={getText(
          content,
          "blog.pagehero.empty.description",
          "We're writing guides on AI content repurposing, humanization, ranking, and multi-platform ad creative to launch alongside the product. Here's what to expect.",
        )}
        descriptionKey="blog.pagehero.empty.description"
      />

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[100rem] gap-4 sm:grid-cols-2">
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
                  contentKey={`blog.categories.${i}.title`}
                  value={getText(content, `blog.categories.${i}.title`, category.title)}
                />
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <EditableText
                  multiline
                  contentKey={`blog.categories.${i}.description`}
                  value={getText(content, `blog.categories.${i}.description`, category.description)}
                />
              </p>
            </div>
          ))}
        </div>
      </section>

      <WaitlistCtaBand
        title={getText(content, "blog.cta.title", "Join the waitlist to get new posts first")}
        titleKey="blog.cta.title"
      />
    </>
  );
}

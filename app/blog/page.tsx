import type { Metadata } from "next";
import { BarChart3, Clapperboard, Megaphone, Wand2 } from "lucide-react";
import Link from "next/link";

import { EditableText } from "@/components/editing/editable-text";
import { PageHero } from "@/components/layout/page-hero";
import { WaitlistCtaBand } from "@/components/sections/waitlist-cta-band";
import { getSiteContent, getText } from "@/lib/content/get-site-content";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and updates on AI content, video, publishing, and ad campaigns — launching alongside MarketLoopAI.",
};

export const revalidate = 60;

const CATEGORIES = [
  {
    title: "AI Content Strategy",
    description: "How to use AI to plan and scale content without losing your brand voice.",
    icon: Wand2,
  },
  {
    title: "AI Video",
    description: "Practical guides for generating product and social video with AI.",
    icon: Clapperboard,
  },
  {
    title: "Paid Ads",
    description: "Playbooks for TikTok, Snapchat, X, and Google Ads campaigns.",
    icon: Megaphone,
  },
  {
    title: "Performance & Analytics",
    description: "Making sense of marketing data across every channel.",
    icon: BarChart3,
  },
];

type Post = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  author_name: string;
  published_at: string | null;
  cover_image_url: string | null;
};

async function getPosts(): Promise<Post[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, title, excerpt, category, author_name, published_at, cover_image_url")
      .eq("published", true)
      .order("published_at", { ascending: false });
    return (data as Post[]) ?? [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  const content = await getSiteContent();

  if (posts.length > 0) {
    return (
      <>
        <PageHero
          eyebrow={getText(content, "blog.pagehero.withposts.eyebrow", "Blog")}
          eyebrowKey="blog.pagehero.withposts.eyebrow"
          title={getText(
            content,
            "blog.pagehero.withposts.title",
            "Guides on AI content, video, and ad campaigns",
          )}
          titleKey="blog.pagehero.withposts.title"
        />
        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[100rem] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="glass flex flex-col gap-3 overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                {post.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_image_url}
                    alt=""
                    className="-mx-6 -mt-6 mb-1 aspect-video w-[calc(100%+3rem)] object-cover"
                  />
                )}
                {post.category && (
                  <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
                    {post.category}
                  </span>
                )}
                <h2 className="text-base font-medium">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                )}
                <p className="mt-auto text-xs text-muted-foreground">
                  {post.author_name}
                  {post.published_at &&
                    ` · ${new Date(post.published_at).toLocaleDateString()}`}
                </p>
              </Link>
            ))}
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
          "We're writing guides on AI content, video, and ad campaigns to launch alongside the product. Here's what to expect.",
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

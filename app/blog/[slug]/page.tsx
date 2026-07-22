import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostCard, type PostCardData } from "@/components/blog/post-card";
import { PostTemplate } from "@/components/blog/post-template";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { BlogTemplate } from "@/lib/validations/blog";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marketloopai.com";

async function getPost(slug: string) {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("blog_posts")
      .select(
        "title, excerpt, content, category, author_name, published_at, updated_at, published, cover_image_url, gallery_image_urls, stats, case_study, template",
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

async function getRelatedPosts(category: string | null, slug: string): Promise<PostCardData[]> {
  try {
    const supabase = createServiceRoleClient();
    let query = supabase
      .from("blog_posts")
      .select("slug, title, excerpt, content, category, author_name, published_at, cover_image_url")
      .eq("published", true)
      .neq("slug", slug)
      .order("published_at", { ascending: false })
      .limit(3);

    if (category) query = query.eq("category", category);

    const { data } = await query;
    if (data && data.length > 0) return data as PostCardData[];

    // Fall back to most recent posts overall if nothing shares the category.
    const { data: fallback } = await supabase
      .from("blog_posts")
      .select("slug, title, excerpt, content, category, author_name, published_at, cover_image_url")
      .eq("published", true)
      .neq("slug", slug)
      .order("published_at", { ascending: false })
      .limit(3);
    return (fallback as PostCardData[]) ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${slug}`;
  const images = post.cover_image_url ? [{ url: post.cover_image_url }] : undefined;

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      url,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      authors: [post.author_name],
      images,
    },
    twitter: {
      card: post.cover_image_url ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt ?? undefined,
      images,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const paragraphs: string[] = post.content.split(/\n{2,}/).map((p: string) => p.trim()).filter(Boolean);
  const related = await getRelatedPosts(post.category, slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.excerpt ?? undefined,
        image: post.cover_image_url ?? undefined,
        author: { "@type": "Person", name: post.author_name },
        datePublished: post.published_at ?? undefined,
        dateModified: post.updated_at ?? post.published_at ?? undefined,
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-script-in-head-component -- structured data, not a runtime script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PostTemplate
        template={(post.template as BlogTemplate) ?? "editorial"}
        title={post.title}
        category={post.category}
        authorName={post.author_name}
        dateLabel={post.published_at ? new Date(post.published_at).toLocaleDateString() : null}
        coverImageUrl={post.cover_image_url}
        excerpt={post.excerpt}
        paragraphs={paragraphs}
        galleryImageUrls={post.gallery_image_urls ?? []}
        stats={post.stats ?? []}
        caseStudy={post.case_study ?? {}}
      />

      {related.length > 0 && (
        <section className="border-t border-border/60 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[100rem]">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Related posts
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedPost) => (
                <PostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

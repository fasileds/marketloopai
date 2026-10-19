import type { MetadataRoute } from "next";

import { createServiceRoleClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marketloopai.com";

const STATIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/features", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/solutions", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/integrations", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/roadmap", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/media", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.7, changeFrequency: "daily" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/referral", priority: 0.4, changeFrequency: "daily" as const },
  { path: "/security", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/trust", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/legal", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/acceptable-use", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/dpa", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/subprocessors", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/ai", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/copyright", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/refunds", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/referral-terms", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/platform-integrations", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/data-deletion", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/google-api", priority: 0.3, changeFrequency: "yearly" as const },
];

async function getBlogSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published", true);
    return (data ?? []).map((row) => ({ slug: row.slug, updatedAt: row.updated_at }));
  } catch {
    return [];
  }
}

async function getLegalSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("legal_pages")
      .select("slug, updated_at")
      .eq("published", true);
    return (data ?? []).map((row) => ({ slug: row.slug, updatedAt: row.updated_at }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const [blogSlugs, legalSlugs] = await Promise.all([getBlogSlugs(), getLegalSlugs()]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const legalEntries: MetadataRoute.Sitemap = legalSlugs.map((page) => ({
    url: `${siteUrl}/legal/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...staticEntries, ...blogEntries, ...legalEntries];
}

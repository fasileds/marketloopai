import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createServiceRoleClient } from "@/lib/supabase/server";

export const revalidate = 60;

async function getPage(slug: string) {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("legal_pages")
      .select("title, content, published, updated_at")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};

  const url = `/legal/${slug}`;

  return {
    title: page.title,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      url,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: page.title,
    },
    robots: { index: false, follow: false },
  };
}

export default async function LegalDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) notFound();

  const paragraphs: string[] = page.content.split(/\n{2,}/).filter(Boolean);

  return (
    <article className="px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-primary">
          Legal
        </span>
        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {page.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated {new Date(page.updated_at).toLocaleDateString()}
        </p>

        <div className="mt-8 space-y-4 text-muted-foreground">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

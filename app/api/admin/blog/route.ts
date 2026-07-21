import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { blogPostSchema } from "@/lib/validations/blog";

const POSTGRES_UNIQUE_VIOLATION = "23505";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const parsed = blogPostSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form for errors." }, { status: 400 });
  }

  const {
    title,
    slug,
    excerpt,
    content,
    category,
    authorName,
    coverImageUrl,
    galleryImageUrls,
    stats,
    caseStudy,
    template,
    published,
  } = parsed.data;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      category: category || null,
      author_name: authorName,
      cover_image_url: coverImageUrl || null,
      gallery_image_urls: galleryImageUrls,
      stats,
      case_study: caseStudy,
      template,
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === POSTGRES_UNIQUE_VIOLATION) {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}

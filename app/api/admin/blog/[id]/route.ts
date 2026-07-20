import DOMPurify from "isomorphic-dompurify";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { blogPostSchema } from "@/lib/validations/blog";

const POSTGRES_UNIQUE_VIOLATION = "23505";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = blogPostSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form for errors." }, { status: 400 });
  }

  const { title, slug, excerpt, content, category, authorName, coverImageUrl, published } = parsed.data;

  const supabase = createServiceRoleClient();

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("published, published_at")
    .eq("id", id)
    .maybeSingle();

  const publishedAt = published ? (existing?.published_at ?? new Date().toISOString()) : null;

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      slug,
      excerpt: excerpt || null,
      content: DOMPurify.sanitize(content),
      category: category || null,
      author_name: authorName,
      cover_image_url: coverImageUrl || null,
      published,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    if (error.code === POSTGRES_UNIQUE_VIOLATION) {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete post." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

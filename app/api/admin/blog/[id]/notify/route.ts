import { NextResponse } from "next/server";

import { blogNotificationEmail, unsubscribeUrl } from "@/lib/email/blog-notification";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getResendClient, RESEND_BLOG_FROM } from "@/lib/resend/client";
import { createServiceRoleClient } from "@/lib/supabase/server";

const BATCH_SIZE = 100;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marketloopai.com";

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

function readMinutes(html: string) {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const resend = getResendClient();
  if (!resend) {
    return NextResponse.json(
      { error: "Resend isn't configured yet — add RESEND_API_KEY to your environment." },
      { status: 503 },
    );
  }

  const { id } = await params;
  const supabase = createServiceRoleClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, content, cover_image_url, category, author_name, published")
    .eq("id", id)
    .maybeSingle();

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  if (!post.published) {
    return NextResponse.json({ error: "Publish the post before notifying subscribers." }, { status: 400 });
  }

  const { data: subscribers, error: subscribersError } = await supabase
    .from("waitlist")
    .select("email")
    .is("unsubscribed_at", null);

  if (subscribersError) {
    return NextResponse.json({ error: "Failed to load subscribers." }, { status: 500 });
  }

  const emails = (subscribers ?? []).map((row) => row.email).filter(Boolean);

  if (emails.length === 0) {
    return NextResponse.json({ error: "No subscribers to notify." }, { status: 400 });
  }

  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const minutes = readMinutes(post.content ?? "");

  let sent = 0;
  for (const batch of chunk(emails, BATCH_SIZE)) {
    const payload = batch.map((email) => {
      const { subject, html } = blogNotificationEmail({
        siteName: "MarketLoopAI",
        postTitle: post.title,
        postExcerpt: post.excerpt,
        postUrl,
        coverImageUrl: post.cover_image_url,
        category: post.category,
        authorName: post.author_name,
        readMinutes: minutes,
        unsubscribeUrl: unsubscribeUrl(email),
      });
      return { from: RESEND_BLOG_FROM, to: email, subject, html };
    });

    const { error } = await resend.batch.send(payload);
    if (error) {
      return NextResponse.json(
        { error: "Failed partway through sending — some subscribers may not have been notified.", sent },
        { status: 502 },
      );
    }
    sent += batch.length;
  }

  await supabase
    .from("blog_posts")
    .update({ notified_at: new Date().toISOString(), notified_count: sent })
    .eq("id", id);

  return NextResponse.json({ ok: true, sent });
}

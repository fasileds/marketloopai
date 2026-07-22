import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { unsubscribeUrl } from "@/lib/email/layout";
import { productUpdateEmail } from "@/lib/email/product-update-templates";
import { getResendClient, RESEND_BLOG_FROM } from "@/lib/resend/client";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { ProductUpdateTemplate } from "@/lib/validations/product-update";

const BATCH_SIZE = 100;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
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

  const { data: update } = await supabase
    .from("product_updates")
    .select("id, title, content, template, cover_image_url")
    .eq("id", id)
    .maybeSingle();

  if (!update) {
    return NextResponse.json({ error: "Update not found." }, { status: 404 });
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
    return NextResponse.json({ error: "No subscribers to send to." }, { status: 400 });
  }

  const paragraphs = update.content.split(/\n{2,}/).map((p: string) => p.trim()).filter(Boolean);

  let sent = 0;
  for (const batch of chunk(emails, BATCH_SIZE)) {
    const payload = batch.map((email) => {
      const { subject, html } = productUpdateEmail(update.template as ProductUpdateTemplate, {
        siteName: "MarketLoopAI",
        title: update.title,
        paragraphs,
        coverImageUrl: update.cover_image_url,
        unsubscribeUrl: unsubscribeUrl(email),
      });
      return { from: RESEND_BLOG_FROM, to: email, subject, html };
    });

    const { error } = await resend.batch.send(payload);
    if (error) {
      return NextResponse.json(
        { error: "Failed partway through sending — some subscribers may not have received it.", sent },
        { status: 502 },
      );
    }
    sent += batch.length;
  }

  await supabase
    .from("product_updates")
    .update({ sent: true, sent_at: new Date().toISOString(), recipient_count: sent })
    .eq("id", id);

  return NextResponse.json({ ok: true, sent });
}

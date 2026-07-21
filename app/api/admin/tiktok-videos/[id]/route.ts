import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { tiktokVideoUpdateSchema } from "@/lib/validations/tiktok-video";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = tiktokVideoUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { caption, customThumbnailUrl, published, sortOrder } = parsed.data;
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (caption !== undefined) update.caption = caption || null;
  if (customThumbnailUrl !== undefined) update.custom_thumbnail_url = customThumbnailUrl || null;
  if (published !== undefined) update.published = published;
  if (sortOrder !== undefined) update.sort_order = sortOrder;

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("tiktok_videos").update(update).eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update the video." }, { status: 500 });
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
  const { error } = await supabase.from("tiktok_videos").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete the video." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

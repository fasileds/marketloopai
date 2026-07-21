import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { fetchTikTokOEmbed } from "@/lib/tiktok/oembed";
import { tiktokVideoCreateSchema } from "@/lib/validations/tiktok-video";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const parsed = tiktokVideoCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid TikTok video URL." }, { status: 400 });
  }

  const { tiktokUrl, caption } = parsed.data;

  const oembed = await fetchTikTokOEmbed(tiktokUrl);
  if (!oembed) {
    return NextResponse.json(
      { error: "Couldn't fetch that video from TikTok. Check the URL and that the video is public." },
      { status: 422 },
    );
  }

  const supabase = createServiceRoleClient();

  const { count } = await supabase
    .from("tiktok_videos")
    .select("*", { count: "exact", head: true });

  const { error } = await supabase.from("tiktok_videos").insert({
    tiktok_url: tiktokUrl,
    video_id: oembed.videoId,
    embed_html: oembed.embedHtml,
    thumbnail_url: oembed.thumbnailUrl,
    title: oembed.title,
    author_name: oembed.authorName,
    caption: caption || null,
    sort_order: count ?? 0,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to save the video." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

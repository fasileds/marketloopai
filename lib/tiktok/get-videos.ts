import { createServiceRoleClient } from "@/lib/supabase/server";

import type { TikTokVideoData } from "@/components/media/tiktok-video-card";

export async function getPublishedTikTokVideos(limit?: number): Promise<TikTokVideoData[]> {
  try {
    const supabase = createServiceRoleClient();
    let query = supabase
      .from("tiktok_videos")
      .select("id, embed_html, thumbnail_url, custom_thumbnail_url, caption, title")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (limit) query = query.limit(limit);

    const { data } = await query;
    return (data as TikTokVideoData[]) ?? [];
  } catch {
    return [];
  }
}

import { TikTokVideoManager, type TikTokVideoRow } from "@/components/admin/tiktok-video-manager";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const metadata = { title: "TikTok Videos" };

async function getVideos(): Promise<TikTokVideoRow[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("tiktok_videos")
      .select(
        "id, tiktok_url, thumbnail_url, custom_thumbnail_url, title, author_name, caption, sort_order, published",
      )
      .order("sort_order", { ascending: true });
    return (data as TikTokVideoRow[]) ?? [];
  } catch {
    return [];
  }
}

export default async function AdminTikTokPage() {
  const videos = await getVideos();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">TikTok Videos</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Shown on the homepage and the Media page. Videos play inline — visitors never leave the
        site.
      </p>

      <div className="mt-6">
        <TikTokVideoManager videos={videos} />
      </div>
    </div>
  );
}

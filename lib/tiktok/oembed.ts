/**
 * Wraps TikTok's official oEmbed endpoint (no API key required). We only
 * call this once, server-side, when an admin adds a video — the response
 * is cached in the database so the public site never depends on TikTok's
 * API being reachable at render time.
 */
export type TikTokOEmbed = {
  embedHtml: string;
  videoId: string | null;
  thumbnailUrl: string | null;
  title: string | null;
  authorName: string | null;
};

export async function fetchTikTokOEmbed(tiktokUrl: string): Promise<TikTokOEmbed | null> {
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (typeof data.html !== "string") return null;

    // TikTok's `html` field bundles the <blockquote> markup with a trailing
    // <script src="…/embed.js"> tag. We load embed.js once globally on the
    // client instead, so strip the script tag to avoid duplicate injections.
    const embedHtml = data.html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").trim();

    const videoIdMatch = /data-video-id="(\d+)"/.exec(data.html);

    return {
      embedHtml,
      videoId: videoIdMatch?.[1] ?? null,
      thumbnailUrl: typeof data.thumbnail_url === "string" ? data.thumbnail_url : null,
      title: typeof data.title === "string" ? data.title : null,
      authorName: typeof data.author_name === "string" ? data.author_name : null,
    };
  } catch {
    return null;
  }
}

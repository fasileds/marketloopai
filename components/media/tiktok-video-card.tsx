"use client";

import { Play } from "lucide-react";
import { useEffect, useState } from "react";

export type TikTokVideoData = {
  id: string;
  embed_html: string;
  thumbnail_url: string | null;
  custom_thumbnail_url: string | null;
  caption: string | null;
  title: string | null;
};

/**
 * Click-to-play card: shows a lightweight thumbnail first, and only mounts
 * TikTok's actual embed (which loads a full iframe) once the visitor clicks
 * — the video then plays inline, without leaving the site.
 */
export function TikTokVideoCard({ video }: { video: TikTokVideoData }) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = video.custom_thumbnail_url ?? video.thumbnail_url;

  useEffect(() => {
    if (!playing) return;
    // TikTok's embed.js scans the DOM for un-hydrated `.tiktok-embed`
    // blockquotes on load. Since this one was inserted after the script
    // already ran once (globally, see TikTokEmbedScript), re-appending a
    // fresh copy forces it to re-scan and hydrate the new blockquote.
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [playing]);

  return (
    <div className="glass flex flex-col overflow-hidden rounded-2xl">
      {playing ? (
        <div
          className="mx-auto w-full [&_.tiktok-embed]:!mx-auto [&_.tiktok-embed]:!max-w-full [&_.tiktok-embed]:!min-w-0 [&_.tiktok-embed]:!w-full [&_iframe]:!w-full"
          dangerouslySetInnerHTML={{ __html: video.embed_html }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group relative block aspect-[9/16] w-full overflow-hidden bg-secondary"
          aria-label={video.title ? `Play: ${video.title}` : "Play video"}
        >
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
            <span className="flex size-14 items-center justify-center rounded-full bg-white/95 text-black shadow-lg transition-transform group-hover:scale-105">
              <Play className="ml-0.5 size-6 fill-current" aria-hidden />
            </span>
          </div>
        </button>
      )}
      {video.caption && <p className="p-3 text-sm text-muted-foreground">{video.caption}</p>}
    </div>
  );
}

import Link from "next/link";

import { TikTokVideoGrid } from "@/components/media/tiktok-video-grid";
import type { TikTokVideoData } from "@/components/media/tiktok-video-card";

import { SectionHeading } from "./section-heading";

export function TikTokShowcase({ videos }: { videos: TikTokVideoData[] }) {
  if (videos.length === 0) return null;

  return (
    <section id="tiktok" className="scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[100rem]">
        <SectionHeading eyebrow="On TikTok" title={<>See the content <span className="text-gradient">in action</span></>} />
        <div className="mt-14">
          <TikTokVideoGrid videos={videos} />
        </div>
        <div className="mt-8 text-center">
          <Link href="/media" className="text-sm font-medium text-primary hover:underline">
            View all videos →
          </Link>
        </div>
      </div>
    </section>
  );
}

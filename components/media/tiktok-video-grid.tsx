import { TikTokVideoCard, type TikTokVideoData } from "./tiktok-video-card";

export function TikTokVideoGrid({ videos, className }: { videos: TikTokVideoData[]; className?: string }) {
  if (videos.length === 0) return null;

  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${className ?? ""}`}>
      {videos.map((video) => (
        <TikTokVideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

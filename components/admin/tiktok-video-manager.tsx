"use client";

import { ArrowDown, ArrowUp, ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export type TikTokVideoRow = {
  id: string;
  tiktok_url: string;
  thumbnail_url: string | null;
  custom_thumbnail_url: string | null;
  title: string | null;
  author_name: string | null;
  caption: string | null;
  sort_order: number;
  published: boolean;
};

export function TikTokVideoManager({ videos }: { videos: TikTokVideoRow[] }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [adding, setAdding] = useState(false);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    const res = await fetch("/api/admin/tiktok-videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tiktokUrl: url, caption }),
    });
    const data = await res.json().catch(() => ({}));
    setAdding(false);

    if (!res.ok) {
      toast.error(data.error ?? "Failed to add video.");
      return;
    }

    toast.success("Video added.");
    setUrl("");
    setCaption("");
    router.refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const other = videos[index + direction];
    const current = videos[index];
    if (!other) return;

    await Promise.all([
      fetch(`/api/admin/tiktok-videos/${current.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: other.sort_order }),
      }),
      fetch(`/api/admin/tiktok-videos/${other.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: current.sort_order }),
      }),
    ]);
    router.refresh();
  }

  async function updateCaption(id: string, value: string) {
    await fetch(`/api/admin/tiktok-videos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption: value }),
    });
    router.refresh();
  }

  async function togglePublished(id: string, published: boolean) {
    await fetch(`/api/admin/tiktok-videos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
    router.refresh();
  }

  async function removeVideo(id: string) {
    if (!window.confirm("Remove this video? This can't be undone.")) return;
    const res = await fetch(`/api/admin/tiktok-videos/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to remove video.");
      return;
    }
    toast.success("Video removed.");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={onAdd} className="glass flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="tiktok-url">
            TikTok video URL
          </label>
          <Input
            id="tiktok-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@user/video/1234567890"
            required
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="tiktok-caption">
            Caption (optional)
          </label>
          <Input
            id="tiktok-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Shown under the video"
          />
        </div>
        <Button type="submit" disabled={adding} className="sm:w-fit">
          {adding ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" aria-hidden />}
          Add video
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        {videos.map((video, index) => (
          <VideoRow
            key={video.id}
            video={video}
            isFirst={index === 0}
            isLast={index === videos.length - 1}
            onMoveUp={() => move(index, -1)}
            onMoveDown={() => move(index, 1)}
            onCaptionCommit={(value) => updateCaption(video.id, value)}
            onTogglePublished={(published) => togglePublished(video.id, published)}
            onRemove={() => removeVideo(video.id)}
            onThumbnailUploaded={() => router.refresh()}
          />
        ))}
        {videos.length === 0 && (
          <p className="text-sm text-muted-foreground">No videos yet — paste a TikTok URL above.</p>
        )}
      </div>
    </div>
  );
}

function VideoRow({
  video,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onCaptionCommit,
  onTogglePublished,
  onRemove,
  onThumbnailUploaded,
}: {
  video: TikTokVideoRow;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onCaptionCommit: (value: string) => void;
  onTogglePublished: (published: boolean) => void;
  onRemove: () => void;
  onThumbnailUploaded: () => void;
}) {
  const [caption, setCaption] = useState(video.caption ?? "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnail = video.custom_thumbnail_url ?? video.thumbnail_url;

  async function uploadThumbnail(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/blog/upload-image", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error ?? "Failed to upload thumbnail.");
      setUploading(false);
      return;
    }
    await fetch(`/api/admin/tiktok-videos/${video.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customThumbnailUrl: data.url }),
    });
    setUploading(false);
    onThumbnailUploaded();
  }

  return (
    <div className="glass flex items-center gap-4 rounded-2xl p-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
        {thumbnail ? (
          <Image src={thumbnail} alt="Video thumbnail" width={64} height={64} className="size-16 object-cover" unoptimized />
        ) : (
          <div className="flex size-16 items-center justify-center text-muted-foreground">
            <ImageIcon className="size-5" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-xs text-muted-foreground">
          {video.author_name ? `@${video.author_name}` : video.tiktok_url}
        </p>
        <Input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onBlur={() => {
            if (caption !== (video.caption ?? "")) onCaptionCommit(caption);
          }}
          placeholder="Caption"
          className="h-8"
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadThumbnail(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
        aria-label="Set custom thumbnail"
        title="Set custom thumbnail"
      >
        {uploading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ImageIcon className="size-4" aria-hidden />}
      </button>

      <div className="flex shrink-0 flex-col">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          aria-label="Move up"
        >
          <ArrowUp className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          aria-label="Move down"
        >
          <ArrowDown className="size-4" aria-hidden />
        </button>
      </div>

      <Switch
        checked={video.published}
        onCheckedChange={onTogglePublished}
        aria-label="Published"
        className="shrink-0"
      />

      <button
        type="button"
        onClick={onRemove}
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        aria-label="Remove video"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </div>
  );
}

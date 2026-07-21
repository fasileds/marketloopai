"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type GalleryVariant = "grid-2" | "grid-3" | "masonry" | "carousel";

const VARIANT_CLASS: Record<GalleryVariant, string> = {
  "grid-2": "grid grid-cols-2 gap-3",
  "grid-3": "grid grid-cols-2 gap-3 sm:grid-cols-3",
  masonry: "columns-2 gap-3 sm:columns-3 [&>*]:mb-3 [&>*]:break-inside-avoid",
  carousel: "flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2",
};

/**
 * Shared image gallery used by every template that displays a post's
 * `gallery_image_urls`. Handles the grid/masonry/carousel presentation and
 * the fullscreen lightbox, so templates only pick a variant.
 */
export function Gallery({
  urls,
  variant = "grid-3",
  className,
}: {
  urls: string[];
  variant?: GalleryVariant;
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (urls.length === 0) return null;

  const isCarousel = variant === "carousel";
  const isMasonry = variant === "masonry";

  return (
    <>
      <div className={cn(VARIANT_CLASS[variant], className)}>
        {urls.map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpenIndex(index)}
            className={cn(
              "group relative block overflow-hidden rounded-xl bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isCarousel && "w-[72%] shrink-0 snap-start sm:w-[42%]",
              !isCarousel && !isMasonry && "aspect-square w-full",
            )}
            aria-label="Open image"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              loading="lazy"
              className={cn(
                "w-full transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
                isMasonry ? "h-auto" : "h-full object-cover",
              )}
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox urls={urls} index={openIndex} onIndex={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}

function Lightbox({
  urls,
  index,
  onIndex,
  onClose,
}: {
  urls: string[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % urls.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + urls.length) % urls.length);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [index, urls.length, onIndex, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        <X className="size-5" aria-hidden />
      </button>

      {urls.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index - 1 + urls.length) % urls.length);
            }}
            className="absolute left-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index + 1) % urls.length);
            }}
            className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
            aria-label="Next image"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={urls[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-full rounded-lg object-contain"
      />

      {urls.length > 1 && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60">
          {index + 1} / {urls.length}
        </p>
      )}
    </div>
  );
}

import { Gallery } from "@/components/blog/gallery";
import { ReadingProgress } from "@/components/blog/reading-progress";

import { initials, type PostTemplateProps } from "./shared";

/**
 * Cover + Gallery Story — a large full-bleed cover leads into a masonry
 * gallery that visually bridges the hero and the article body, then settles
 * into a comfortable single reading column.
 */
export function CoverGalleryTemplate({
  title,
  category,
  authorName,
  dateLabel,
  coverImageUrl,
  excerpt,
  paragraphs,
  galleryImageUrls,
}: PostTemplateProps) {
  return (
    <article className="pb-24">
      <ReadingProgress />

      {coverImageUrl ? (
        <div className="relative isolate h-[52svh] min-h-[360px] w-full overflow-hidden sm:h-[64svh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImageUrl}
            alt={title}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        </div>
      ) : (
        <div className="relative isolate h-[38svh] min-h-[260px] w-full overflow-hidden bg-secondary">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="animate-aurora absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
              style={{ background: "radial-gradient(circle at center, var(--glow-primary), transparent 65%)" }}
            />
            <div
              className="animate-aurora absolute bottom-0 right-0 h-[50vh] w-[50vh] translate-x-1/4 translate-y-1/4 rounded-full opacity-20 blur-[100px]"
              style={{ background: "radial-gradient(circle at center, var(--glow-accent), transparent 70%)", animationDelay: "-4s" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      )}

      <div className="mx-auto -mt-16 max-w-3xl px-4 sm:-mt-20 sm:px-6 lg:px-8">
        <div className="glass glow-border rounded-3xl px-6 py-8 sm:px-10 sm:py-10">
          {category && (
            <span className="inline-block rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
              {category}
            </span>
          )}
          <h1 className="mt-4 text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>

          <div className="mt-5 flex items-center gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initials(authorName)}
            </span>
            <span>
              <span className="font-medium text-foreground">{authorName}</span>
              {dateLabel && ` · ${dateLabel}`}
            </span>
          </div>
        </div>
      </div>

      {excerpt && (
        <div className="mx-auto mt-10 max-w-2xl px-4 sm:px-6 lg:px-8">
          <p className="text-balance text-xl font-medium leading-[1.5] text-foreground sm:text-2xl">{excerpt}</p>
        </div>
      )}

      {galleryImageUrls.length > 0 && (
        <div className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
          <Gallery urls={galleryImageUrls} variant="masonry" altPrefix={title} />
        </div>
      )}

      <div className="mx-auto mt-12 max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 text-[18px] leading-[1.75] text-muted-foreground">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

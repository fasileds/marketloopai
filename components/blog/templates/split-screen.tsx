import { Gallery } from "@/components/blog/gallery";
import { ReadingProgress } from "@/components/blog/reading-progress";

import { initials, type PostTemplateProps } from "./shared";

/**
 * Split-Screen Story — an asymmetric two-column article.
 * Desktop: text column on the left scrolls past a sticky image/mini-gallery
 * column on the right. Mobile: an intentional stacked flow (meta → image → copy).
 */
export function SplitScreenTemplate({
  title,
  category,
  authorName,
  dateLabel,
  coverImageUrl,
  paragraphs,
  galleryImageUrls,
}: PostTemplateProps) {
  const thumbs = galleryImageUrls.slice(0, coverImageUrl ? 3 : 4);

  const ImagePanel = (
    <div className="lg:sticky lg:top-24 lg:self-start">
      {coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImageUrl}
          alt={title}
          className="aspect-[4/5] w-full rounded-3xl object-cover shadow-[0_32px_64px_-32px_rgba(0,0,0,0.45)] lg:aspect-[3/4]"
        />
      ) : (
        <div className="relative isolate aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-secondary lg:aspect-[3/4]">
          <div
            className="animate-aurora absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[90px]"
            style={{ background: "radial-gradient(circle at center, var(--glow-primary), var(--glow-accent) 70%, transparent)" }}
          />
        </div>
      )}

      {thumbs.length > 0 && (
        <div className="mt-4">
          <Gallery urls={thumbs} variant="grid-2" altPrefix={title} />
        </div>
      )}
    </div>
  );

  return (
    <article className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <ReadingProgress />
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        {/* Text column: meta + heading + body copy */}
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-700 order-2 lg:order-1">
          {category && (
            <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
              {category}
            </span>
          )}
          <h1 className="mt-4 text-balance text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          <div className="mt-5 flex items-center gap-2.5 border-b border-border pb-6 text-sm text-muted-foreground">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initials(authorName)}
            </span>
            <span>
              {authorName}
              {dateLabel && ` · ${dateLabel}`}
            </span>
          </div>

          {/* Image panel appears here on mobile only, between meta and copy */}
          <div className="mt-8 lg:hidden">{ImagePanel}</div>

          <div className="mt-8 space-y-5 text-[17px] leading-[1.75] text-muted-foreground lg:mt-10">
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Sticky image column: desktop only */}
        <div className="order-1 hidden lg:order-2 lg:block">{ImagePanel}</div>
      </div>
    </article>
  );
}

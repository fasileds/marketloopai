import { Gallery } from "@/components/blog/gallery";
import { ReadingProgress } from "@/components/blog/reading-progress";

import { initials, type PostTemplateProps } from "./shared";

/**
 * Visual Storytelling — an immersive, image-led layout. A full-bleed hero
 * with oversized type opens the piece, paragraph groups are interrupted by
 * full-width visual breaks, and the excerpt lands as an oversized statement
 * partway through rather than a quiet aside.
 */
export function VisualStoryTemplate({
  title,
  category,
  authorName,
  dateLabel,
  coverImageUrl,
  excerpt,
  paragraphs,
  galleryImageUrls,
}: PostTemplateProps) {
  const groupSize = Math.max(1, Math.ceil(paragraphs.length / 3));
  const groupOne = paragraphs.slice(0, groupSize);
  const groupTwo = paragraphs.slice(groupSize, groupSize * 2);
  const groupThree = paragraphs.slice(groupSize * 2);

  const breakImageOne = galleryImageUrls[0];
  const breakImageTwo = galleryImageUrls[1];
  const remainingGalleryImages = galleryImageUrls.slice(2);

  return (
    <article className="pb-24">
      <ReadingProgress />

      {coverImageUrl ? (
        <div className="relative isolate flex min-h-[60svh] items-end overflow-hidden sm:min-h-[80svh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImageUrl}
            alt={title}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 motion-safe:duration-700 mx-auto w-full max-w-5xl px-4 pb-16 pt-32 sm:px-6 sm:pt-40 lg:px-8">
            {category && (
              <span className="inline-block rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
                {category}
              </span>
            )}
            <h1 className="mt-5 max-w-4xl text-balance text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-7xl sm:leading-[0.98]">
              {title}
            </h1>
            <p className="mt-6 flex items-center gap-3 text-sm font-medium text-white/70">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white">
                {initials(authorName)}
              </span>
              {authorName}
              {dateLabel && ` · ${dateLabel}`}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative isolate overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pt-40 lg:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div
              className="animate-aurora absolute right-[10%] top-[-20%] h-[70vh] w-[70vh] rounded-full opacity-30 blur-[130px]"
              style={{ background: "radial-gradient(circle at center, var(--glow-primary), transparent 65%)" }}
            />
            <div
              className="animate-aurora absolute bottom-[-20%] left-[5%] h-[55vh] w-[55vh] rounded-full opacity-20 blur-[110px]"
              style={{ background: "radial-gradient(circle at center, var(--glow-accent), transparent 70%)", animationDelay: "-3s" }}
            />
          </div>
          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 motion-safe:duration-700 mx-auto w-full max-w-5xl">
            {category && (
              <span className="inline-block rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
                {category}
              </span>
            )}
            <h1 className="mt-5 max-w-4xl text-balance text-4xl font-black leading-[1.02] tracking-tight text-foreground sm:text-7xl sm:leading-[0.98]">
              {title}
            </h1>
            <p className="mt-6 flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {initials(authorName)}
              </span>
              {authorName}
              {dateLabel && ` · ${dateLabel}`}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto mt-14 max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 text-[18px] leading-[1.75] text-muted-foreground">
          {groupOne.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {breakImageOne && (
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700 mx-auto mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
          <Gallery urls={[breakImageOne]} variant="grid-2" className="!grid-cols-1" altPrefix={title} />
        </div>
      )}

      {groupTwo.length > 0 && (
        <div className="mx-auto mt-14 max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-[18px] leading-[1.75] text-muted-foreground">
            {groupTwo.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {excerpt && (
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700 mx-auto mt-16 max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-balance text-center text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl">
            <span className="text-primary">&ldquo;</span>
            {excerpt}
            <span className="text-primary">&rdquo;</span>
          </p>
        </div>
      )}

      {breakImageTwo && (
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700 mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
          <Gallery urls={[breakImageTwo]} variant="grid-2" className="!grid-cols-1" altPrefix={title} />
        </div>
      )}

      {groupThree.length > 0 && (
        <div className="mx-auto mt-14 max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-[18px] leading-[1.75] text-muted-foreground">
            {groupThree.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {remainingGalleryImages.length >= 3 && (
        <div className="mx-auto mt-16 max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">More from this story</p>
          <Gallery urls={remainingGalleryImages} variant="grid-3" altPrefix={title} />
        </div>
      )}
    </article>
  );
}

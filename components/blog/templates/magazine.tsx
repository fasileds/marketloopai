import { Gallery } from "@/components/blog/gallery";
import { ReadingProgress } from "@/components/blog/reading-progress";

import { initials, type PostTemplateProps } from "./shared";

/** Bold, high-contrast magazine layout — full-bleed cover, oversized pull quote, featured stats. */
export function MagazineTemplate({
  title,
  category,
  authorName,
  dateLabel,
  coverImageUrl,
  excerpt,
  paragraphs,
  galleryImageUrls,
  stats,
}: PostTemplateProps) {
  const midpoint = Math.floor(paragraphs.length / 2);
  const pullQuote = excerpt ?? paragraphs[0] ?? null;

  return (
    <article className="pb-24">
      <ReadingProgress />
      {coverImageUrl ? (
        <div className="relative isolate flex min-h-[60svh] items-end overflow-hidden pt-32">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImageUrl}
            alt={title}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-700 mx-auto w-full max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
            {category && (
              <span className="inline-block rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
                {category}
              </span>
            )}
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
              {title}
            </h1>
            <p className="mt-4 flex items-center gap-2.5 text-sm font-medium text-white/70">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-semibold text-white">
                {initials(authorName)}
              </span>
              {authorName}
              {dateLabel && ` · ${dateLabel}`}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative isolate overflow-hidden px-4 pt-40 pb-16 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div
              className="animate-aurora absolute left-1/2 top-[-30%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
              style={{ background: "radial-gradient(circle at center, var(--glow-primary), transparent 65%)" }}
            />
          </div>
          <div className="mx-auto w-full max-w-4xl">
            {category && (
              <span className="inline-block rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
                {category}
              </span>
            )}
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              {title}
            </h1>
            <p className="mt-4 flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                {initials(authorName)}
              </span>
              {authorName}
              {dateLabel && ` · ${dateLabel}`}
            </p>
          </div>
        </div>
      )}

      {stats.length > 0 && (
        <div className="mx-auto -mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="glass grid grid-cols-2 gap-4 rounded-2xl p-6 sm:grid-cols-3 sm:p-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto mt-14 max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 text-[18px] leading-[1.65] text-muted-foreground">
          {paragraphs.map((paragraph, i) => (
            <div key={i}>
              <p>{paragraph}</p>
              {i === midpoint && pullQuote && (
                <blockquote className="my-10 border-l-4 border-primary pl-6 text-2xl font-bold leading-snug tracking-tight text-foreground">
                  &ldquo;{pullQuote}&rdquo;
                </blockquote>
              )}
            </div>
          ))}
        </div>

        {galleryImageUrls.length > 0 && (
          <Gallery urls={galleryImageUrls} variant="grid-3" className="mt-12" altPrefix={title} />
        )}
      </div>
    </article>
  );
}

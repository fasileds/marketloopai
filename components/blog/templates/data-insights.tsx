import { Gallery } from "@/components/blog/gallery";
import { ReadingProgress } from "@/components/blog/reading-progress";

import { initials, type PostTemplateProps } from "./shared";

/**
 * Data & Insights — a clinical, scan-first layout for research, market analysis,
 * and industry reports. Stats are the centerpiece, rendered as a prominent grid
 * of tabular-numeric cards right under the header, before any prose.
 */
export function DataInsightsTemplate({
  title,
  category,
  authorName,
  dateLabel,
  coverImageUrl,
  paragraphs,
  galleryImageUrls,
  stats,
}: PostTemplateProps) {
  const wordCount = (p: string) => p.trim().split(/\s+/).filter(Boolean).length;
  const insightIndex = paragraphs.findIndex((p) => wordCount(p) <= 25);

  return (
    <article className="pb-24">
      <ReadingProgress />

      <div className="relative isolate overflow-hidden border-b border-border px-4 pt-32 pb-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.25]" />
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center gap-3">
            {category && (
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-secondary px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                {category}
              </span>
            )}
            {dateLabel && (
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {dateLabel}
              </span>
            )}
          </div>

          <h1 className="mt-4 max-w-3xl text-balance text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <div className="mt-5 flex items-center gap-2.5 text-sm text-muted-foreground">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-[11px] font-semibold text-primary">
              {initials(authorName)}
            </span>
            <span className="font-medium">{authorName}</span>
          </div>
        </div>
      </div>

      {coverImageUrl && (
        <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImageUrl}
            alt=""
            className="aspect-[21/9] w-full rounded-sm border border-border object-cover"
          />
        </div>
      )}

      {stats.length > 0 && (
        <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Key figures
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="glass flex flex-col justify-between rounded-md border border-border p-5"
              >
                <p className="tabular-nums text-3xl font-extrabold leading-none tracking-tight text-foreground sm:text-4xl">
                  {stat.value}
                </p>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-foreground">{stat.label}</p>
                  {stat.description && (
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">{stat.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto mt-14 max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-5 text-[17px] leading-[1.75] text-muted-foreground">
          {paragraphs.map((paragraph, i) =>
            i === insightIndex ? (
              <p
                key={i}
                className="border-l-2 border-primary bg-primary/5 py-3 pl-5 pr-4 text-base font-medium leading-snug text-foreground"
              >
                {paragraph}
              </p>
            ) : (
              <p key={i}>{paragraph}</p>
            ),
          )}
        </div>

        {galleryImageUrls.length > 0 && (
          <div className="mt-12">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Figure — supporting data
            </p>
            <Gallery urls={galleryImageUrls} variant="grid-2" className="rounded-sm" />
          </div>
        )}
      </div>
    </article>
  );
}

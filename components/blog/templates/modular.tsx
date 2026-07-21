import { Gallery } from "@/components/blog/gallery";
import { ReadingProgress } from "@/components/blog/reading-progress";

import { initials, type PostTemplateProps } from "./shared";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Creative Modular Layout — a content-driven grid of mixed block types
 * (intro, pull-quote, text, image, stat) laid out on a 6-column desktop
 * grid with `grid-flow-row-dense` to pack varying block sizes without gaps.
 * Collapses to a single readable column on mobile, in DOM order.
 */
export function ModularTemplate({
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
  const textGroups = chunk(paragraphs, 2);
  const heroImage = coverImageUrl ?? galleryImageUrls[0] ?? null;
  const remainingImages = coverImageUrl ? galleryImageUrls : galleryImageUrls.slice(1);
  const singleImages = remainingImages.slice(0, 2);
  const clusterImages = remainingImages.slice(2);

  const textSpans = ["lg:col-span-4", "lg:col-span-3", "lg:col-span-4"];
  const imageSpans = ["lg:col-span-2", "lg:col-span-3"];

  return (
    <article className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <ReadingProgress />
      <div className="mx-auto max-w-6xl">
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-700 grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-flow-row-dense lg:gap-5">
          {/* Header block: full width */}
          <div className="lg:col-span-6">
            {category && (
              <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
                {category}
              </span>
            )}
            <h1 className="mt-4 max-w-4xl text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
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
          </div>

          {/* Pull quote block */}
          {excerpt && (
            <div
              className={`flex min-h-[220px] flex-col justify-center rounded-3xl bg-primary p-8 text-primary-foreground ${
                heroImage ? "lg:col-span-3" : "lg:col-span-6"
              }`}
            >
              <span className="mb-2 text-4xl font-black leading-none opacity-60">&ldquo;</span>
              <p className="text-xl font-bold leading-snug tracking-tight sm:text-2xl">{excerpt}</p>
            </div>
          )}

          {/* Hero image block */}
          {heroImage && (
            <div
              className={`min-h-[220px] overflow-hidden rounded-3xl ${excerpt ? "lg:col-span-3" : "lg:col-span-6"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt="" className="h-full min-h-[220px] w-full object-cover" />
            </div>
          )}

          {/* Interleaved text, image, and stat blocks */}
          {textGroups.map((group, i) => (
            <div
              key={`text-${i}`}
              className={`rounded-2xl border border-border bg-secondary/40 p-6 lg:p-8 ${textSpans[i % textSpans.length]}`}
            >
              <div className="space-y-4 text-[16px] leading-[1.75] text-muted-foreground">
                {group.map((paragraph, j) => (
                  <p key={j}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}

          {singleImages.map((url, i) => (
            <div key={`img-${i}`} className={`min-h-[200px] overflow-hidden rounded-2xl ${imageSpans[i % imageSpans.length]}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full min-h-[200px] w-full object-cover" />
            </div>
          ))}

          {stats.map((stat, i) => (
            <div
              key={`stat-${i}`}
              className="glow-border flex min-h-[160px] flex-col justify-center rounded-2xl bg-secondary p-6 lg:col-span-2"
            >
              <p className="text-4xl font-extrabold tracking-tight text-primary">{stat.value}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              {stat.description && <p className="mt-2 text-sm text-muted-foreground">{stat.description}</p>}
            </div>
          ))}

          {/* Remaining gallery images as a full-width cluster */}
          {clusterImages.length > 0 && (
            <div className="lg:col-span-6">
              <Gallery urls={clusterImages} variant="grid-3" />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

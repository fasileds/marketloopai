import { Gallery } from "@/components/blog/gallery";
import { ReadingProgress } from "@/components/blog/reading-progress";

import type { PostTemplateProps } from "./shared";

/** Quiet, understated layout — small type, generous whitespace, no ornamentation. */
export function MinimalTemplate({
  title,
  category,
  authorName,
  dateLabel,
  coverImageUrl,
  paragraphs,
  galleryImageUrls,
}: PostTemplateProps) {
  return (
    <article className="px-4 pt-40 pb-32 sm:px-6 lg:px-8">
      <ReadingProgress />
      <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700 mx-auto max-w-xl">
        {category && <p className="text-xs tracking-wide text-muted-foreground">{category}</p>}
        <h1 className="mt-3 text-balance text-2xl font-medium tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          {authorName}
          {dateLabel && ` · ${dateLabel}`}
        </p>

        {coverImageUrl && (
          <div className="mt-10 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImageUrl} alt="" className="aspect-video w-full max-w-sm rounded-md object-cover" />
          </div>
        )}

        <div className="mt-12 space-y-8 text-[15px] leading-[1.75] text-muted-foreground">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {galleryImageUrls.length > 0 && <Gallery urls={galleryImageUrls} variant="grid-3" className="mt-12" />}
      </div>
    </article>
  );
}

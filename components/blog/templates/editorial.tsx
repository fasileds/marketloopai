import { Gallery } from "@/components/blog/gallery";
import { ReadingProgress } from "@/components/blog/reading-progress";

import { initials, type PostTemplateProps } from "./shared";

const SERIF = "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

/** Classic, readable long-form layout — serif type, narrow column, drop cap. */
export function EditorialTemplate({
  title,
  category,
  authorName,
  dateLabel,
  coverImageUrl,
  paragraphs,
  galleryImageUrls,
}: PostTemplateProps) {
  return (
    <article className="px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      <ReadingProgress />
      <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-700 mx-auto max-w-2xl">
        {category && (
          <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
            {category}
          </span>
        )}
        <h1
          className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
          style={{ fontFamily: SERIF }}
        >
          {title}
        </h1>

        <div className="mt-5 flex items-center gap-2.5 border-t border-border pt-5 text-sm text-muted-foreground">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials(authorName)}
          </span>
          <span>
            {authorName}
            {dateLabel && ` · ${dateLabel}`}
          </span>
        </div>

        {coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageUrl}
            alt=""
            className="mt-8 aspect-video w-full rounded-2xl object-cover shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)]"
          />
        )}

        <div className="mt-10 space-y-5 text-[18px] leading-[1.85] text-muted-foreground" style={{ fontFamily: SERIF }}>
          {paragraphs.map((paragraph, i) =>
            i === 0 ? (
              <p key={i}>
                <span
                  className="float-left mr-2.5 mt-1.5 font-semibold leading-[0.75] text-foreground"
                  style={{ fontSize: "3.6em" }}
                >
                  {paragraph.charAt(0)}
                </span>
                {paragraph.slice(1)}
              </p>
            ) : (
              <p key={i}>{paragraph}</p>
            ),
          )}
        </div>

        {galleryImageUrls.length > 0 && (
          <div className="mt-12">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">Gallery</p>
            <Gallery urls={galleryImageUrls} variant="masonry" />
          </div>
        )}
      </div>
    </article>
  );
}

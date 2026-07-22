import { Gallery } from "@/components/blog/gallery";
import { ReadingProgress } from "@/components/blog/reading-progress";

import { initials, type PostTemplateProps } from "./shared";
import type { BlogStat } from "@/lib/validations/blog";

/** Reuses the stat-card treatment from Data & Insights, scoped to the Results section. */
function ResultStats({ stats }: { stats: BlogStat[] }) {
  if (stats.length === 0) return null;
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <div key={i} className="glass rounded-md border border-border p-5">
          <p className="tabular-nums text-3xl font-extrabold leading-none tracking-tight text-foreground">
            {stat.value}
          </p>
          <p className="mt-2.5 text-xs font-semibold text-foreground">{stat.label}</p>
          {stat.description && <p className="mt-1 text-xs leading-snug text-muted-foreground">{stat.description}</p>}
        </div>
      ))}
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: string }) {
  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-primary">{heading}</h2>
      <p className="mt-4 text-[17px] leading-[1.75] text-muted-foreground">{children}</p>
    </section>
  );
}

/**
 * Case Study — premium client-narrative layout. Structure is driven almost
 * entirely by the `caseStudy` object (challenge → goals → strategy →
 * implementation → results → testimonial → conclusion), each section only
 * rendered when its field is present. Falls back to a plain article body
 * when `caseStudy` is entirely empty.
 */
export function CaseStudyTemplate({
  title,
  category,
  authorName,
  dateLabel,
  coverImageUrl,
  paragraphs,
  galleryImageUrls,
  stats,
  caseStudy,
}: PostTemplateProps) {
  const hasCaseStudy = Boolean(
    caseStudy.client ||
      caseStudy.challenge ||
      caseStudy.goals ||
      caseStudy.strategy ||
      caseStudy.implementation ||
      caseStudy.results ||
      caseStudy.testimonialQuote ||
      caseStudy.conclusion,
  );

  return (
    <article className="pb-24">
      <ReadingProgress />

      <div className="relative isolate overflow-hidden px-4 pt-32 pb-14 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="animate-aurora absolute right-[-10%] top-[-25%] h-[50vh] w-[50vh] rounded-full opacity-25 blur-[110px]"
            style={{ background: "radial-gradient(circle at center, var(--glow-accent), transparent 65%)" }}
          />
        </div>

        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-700 mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            {category && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
                {category}
              </span>
            )}
            {caseStudy.client && (
              <span className="glow-border relative inline-flex items-center rounded-full border border-border bg-secondary px-3 py-0.5 text-[11px] font-semibold text-foreground">
                Client: {caseStudy.client}
              </span>
            )}
          </div>

          <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">{title}</h1>

          <div className="mt-5 flex items-center gap-2.5 text-sm text-muted-foreground">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initials(authorName)}
            </span>
            <span>
              {authorName}
              {dateLabel && ` · ${dateLabel}`}
            </span>
          </div>
        </div>
      </div>

      {coverImageUrl ? (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImageUrl}
            alt={title}
            className="aspect-video w-full rounded-2xl object-cover shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)]"
          />
        </div>
      ) : (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="glow-border relative flex aspect-[21/9] items-center justify-center overflow-hidden rounded-2xl border border-border bg-secondary">
            <span className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {caseStudy.client || category || "Case Study"}
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto mt-12 max-w-2xl px-4 sm:px-6 lg:px-8">
        {paragraphs.length > 0 && (
          <div className={hasCaseStudy ? "space-y-5 text-[18px] leading-[1.8] text-foreground" : "space-y-5 text-[18px] leading-[1.8] text-muted-foreground"}>
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}

        {hasCaseStudy && (
          <div className="mt-10 space-y-8">
            {caseStudy.challenge && <Section heading="Challenge">{caseStudy.challenge}</Section>}
            {caseStudy.goals && <Section heading="Goals">{caseStudy.goals}</Section>}
            {caseStudy.strategy && <Section heading="Strategy">{caseStudy.strategy}</Section>}
            {caseStudy.implementation && <Section heading="Implementation">{caseStudy.implementation}</Section>}

            {galleryImageUrls.length > 0 && (
              <div className="border-t border-border pt-8">
                <Gallery urls={galleryImageUrls} variant="grid-3" altPrefix={title} />
              </div>
            )}

            {caseStudy.results && (
              <section className="border-t border-border pt-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-primary">Results</h2>
                <p className="mt-4 text-[17px] leading-[1.75] text-muted-foreground">{caseStudy.results}</p>
                <ResultStats stats={stats} />
              </section>
            )}

            {caseStudy.testimonialQuote && (
              <div className="glass rounded-2xl border border-border px-8 py-10 text-center">
                <span className="text-5xl font-serif leading-none text-primary/40" aria-hidden>
                  &ldquo;
                </span>
                <p className="mx-auto mt-2 max-w-xl text-balance text-xl font-medium leading-snug tracking-tight text-foreground">
                  {caseStudy.testimonialQuote}
                </p>
                {caseStudy.testimonialAuthor && (
                  <p className="mt-4 text-sm font-medium text-muted-foreground">{caseStudy.testimonialAuthor}</p>
                )}
              </div>
            )}

            {caseStudy.conclusion && (
              <section className="border-t border-border pt-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-primary">Conclusion</h2>
                <p className="mt-4 text-[17px] leading-[1.75] text-muted-foreground">{caseStudy.conclusion}</p>
              </section>
            )}
          </div>
        )}

        {!hasCaseStudy && galleryImageUrls.length > 0 && (
          <Gallery urls={galleryImageUrls} variant="grid-3" className="mt-12" altPrefix={title} />
        )}
      </div>
    </article>
  );
}

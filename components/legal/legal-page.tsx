"use client";

import { useEffect, useState } from "react";

import { EditableText } from "@/components/editing/editable-text";

export type LegalContentBlock =
  | { text: string; key: string }
  | { list: { text: string; key: string }[] };

export type LegalSection = {
  id: string;
  heading: string;
  headingKey: string;
  content: LegalContentBlock[];
};

function wordCount(sections: LegalSection[]) {
  return sections.reduce((total, section) => {
    const headingWords = section.heading.split(/\s+/).length;
    const bodyWords = section.content.reduce((sum, block) => {
      if ("text" in block) return sum + block.text.split(/\s+/).length;
      return sum + block.list.map((item) => item.text).join(" ").split(/\s+/).length;
    }, 0);
    return total + headingWords + bodyWords;
  }, 0);
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed inset-x-0 top-16 z-40 h-0.5 bg-transparent print:hidden">
      <div
        className="h-full bg-primary transition-[width]"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

export function LegalPage({
  eyebrow,
  eyebrowKey,
  title,
  titleKey,
  lastUpdated,
  sections,
}: {
  eyebrow: string;
  eyebrowKey?: string;
  title: string;
  titleKey?: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  const minutes = Math.max(1, Math.round(wordCount(sections) / 200));

  return (
    <>
      <ReadingProgress />

      <section className="px-4 pt-32 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[100rem]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-primary">
            {eyebrowKey ? <EditableText contentKey={eyebrowKey} value={eyebrow} /> : eyebrow}
          </span>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {titleKey ? <EditableText contentKey={titleKey} value={title} /> : title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated {lastUpdated} · {minutes} min read
          </p>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8 print:px-0">
        <div className="mx-auto grid max-w-[100rem] gap-10 lg:grid-cols-[220px_1fr]">
          <nav
            aria-label="Table of contents"
            className="hidden lg:sticky lg:top-24 lg:block lg:h-fit print:hidden"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              On this page
            </p>
            <ul className="space-y-2 border-l border-border text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px block border-l border-transparent py-0.5 pl-4 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-3xl space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl font-semibold tracking-tight">
                  <EditableText contentKey={section.headingKey} value={section.heading} />
                </h2>
                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                  {section.content.map((block, i) =>
                    "text" in block ? (
                      <p key={i}>
                        <EditableText contentKey={block.key} value={block.text} multiline />
                      </p>
                    ) : (
                      <ul key={i} className="list-disc space-y-1.5 pl-5">
                        {block.list.map((item) => (
                          <li key={item.key}>
                            <EditableText contentKey={item.key} value={item.text} multiline />
                          </li>
                        ))}
                      </ul>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import type { ReactNode } from "react";

import { EditableHeading } from "@/components/editing/editable-heading";
import { EditableText } from "@/components/editing/editable-text";

export function PageHero({
  eyebrow,
  eyebrowKey,
  title,
  titleKey,
  description,
  descriptionKey,
}: {
  eyebrow: ReactNode;
  eyebrowKey?: string;
  title: ReactNode;
  titleKey?: string;
  description?: ReactNode;
  descriptionKey?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden px-4 pt-40 pb-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="animate-aurora absolute left-1/2 top-[-30%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
          style={{
            background: "radial-gradient(circle at center, var(--glow-primary), transparent 65%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-primary">
          {eyebrowKey && typeof eyebrow === "string" ? (
            <EditableText contentKey={eyebrowKey} value={eyebrow} />
          ) : (
            eyebrow
          )}
        </span>
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {titleKey && typeof title === "string" ? (
            <EditableHeading contentKey={titleKey} value={title} />
          ) : (
            title
          )}
        </h1>
        {description && (
          <p className="mt-5 text-balance text-lg text-muted-foreground">
            {descriptionKey && typeof description === "string" ? (
              <EditableText contentKey={descriptionKey} value={description} multiline />
            ) : (
              description
            )}
          </p>
        )}
      </div>
    </section>
  );
}

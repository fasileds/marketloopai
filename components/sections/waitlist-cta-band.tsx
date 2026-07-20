import type { ReactNode } from "react";
import Link from "next/link";

import { EditableHeading } from "@/components/editing/editable-heading";
import { EditableText } from "@/components/editing/editable-text";
import { Button } from "@/components/ui/button";

export function WaitlistCtaBand({
  title,
  titleKey,
  description,
  descriptionKey,
}: {
  title: ReactNode;
  titleKey?: string;
  description?: ReactNode;
  descriptionKey?: string;
}) {
  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {titleKey && typeof title === "string" ? (
            <EditableHeading contentKey={titleKey} value={title} />
          ) : (
            title
          )}
        </h2>
        {description && (
          <p className="mt-4 text-muted-foreground">
            {descriptionKey && typeof description === "string" ? (
              <EditableText contentKey={descriptionKey} value={description} multiline />
            ) : (
              description
            )}
          </p>
        )}
        <Button
          size="lg"
          className="mt-8 h-11 px-6 text-sm"
          nativeButton={false}
          render={<Link href="/#waitlist" />}
        >
          Join Waitlist
        </Button>
      </div>
    </section>
  );
}

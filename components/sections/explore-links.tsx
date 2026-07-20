import { ArrowUpRight, Layers, Puzzle, Target } from "lucide-react";
import Link from "next/link";

import { EditableText } from "@/components/editing/editable-text";

export type ExploreItem = { title: string; description: string };

const LINKS = [
  { href: "/features", icon: Layers },
  { href: "/solutions", icon: Target },
  { href: "/integrations", icon: Puzzle },
] as const;

export function ExploreLinks({ items }: { items: ExploreItem[] }) {
  return (
    <section id="explore" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[100rem] gap-4 sm:grid-cols-3">
        {LINKS.map((link, index) => {
          const item = items[index];
          return (
            <Link
              key={link.href}
              href={link.href}
              className="glow-border glass group relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <link.icon className="size-5" aria-hidden />
                </div>
                <ArrowUpRight
                  className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </div>
              <h3 className="text-base font-medium">
                <EditableText contentKey={`home.explore.items.${index}.title`} value={item.title} />
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <EditableText
                  contentKey={`home.explore.items.${index}.description`}
                  value={item.description}
                  multiline
                />
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

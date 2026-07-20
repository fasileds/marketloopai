"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building2, Rocket, ShoppingBag, User, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import { EditableText } from "@/components/editing/editable-text";

const SOLUTIONS_ICONS: Record<string, LucideIcon> = {
  shopify: ShoppingBag,
  saas: Rocket,
  personal: User,
  agencies: Users,
  smb: Building2,
};

export type SolutionItem = { id: string; label: string; headline: string; points: string[] };

export function Solutions({ items }: { items: SolutionItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const activeIndex = Math.max(
    0,
    items.findIndex((s) => s.id === active),
  );
  const solution = items[activeIndex];

  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[100rem]">
        <div className="flex flex-wrap justify-center gap-2">
          {items.map((s, index) => {
            const Icon = SOLUTIONS_ICONS[s.id];
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                  active === s.id
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="size-4" aria-hidden />}
                <EditableText contentKey={`solutions.items.${index}.label`} value={s.label} />
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {solution && (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="glass noise-overlay mx-auto mt-10 max-w-3xl rounded-2xl p-8 sm:p-10"
            >
              <h3 className="text-xl font-semibold sm:text-2xl">
                <EditableText
                  contentKey={`solutions.items.${activeIndex}.headline`}
                  value={solution.headline}
                />
              </h3>
              <ul className="mt-6 space-y-3">
                {solution.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    <EditableText
                      contentKey={`solutions.items.${activeIndex}.points.${pointIndex}`}
                      value={point}
                    />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

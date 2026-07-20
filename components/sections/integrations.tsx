"use client";

import { motion } from "framer-motion";
import {
  AtSign,
  Briefcase,
  Camera,
  Music2,
  ShoppingBag,
  Sparkle,
  Store,
  ThumbsUp,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { EditableText } from "@/components/editing/editable-text";

const INTEGRATIONS_ICONS: LucideIcon[] = [
  Music2,
  Sparkle,
  Briefcase,
  Camera,
  ThumbsUp,
  AtSign,
  Sparkle,
  ShoppingBag,
  Store,
  Store,
  Video,
];

export function Integrations({ items }: { items: { name: string }[] }) {
  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[100rem]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((integration, index) => {
            const Icon = INTEGRATIONS_ICONS[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
                className="glass flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition-colors hover:border-primary/40"
              >
                {Icon && <Icon className="size-4 text-primary" aria-hidden />}
                <EditableText contentKey={`integrations.items.${index}.name`} value={integration.name} />
              </motion.div>
            );
          })}
          <div className="glass flex items-center justify-center rounded-xl px-4 py-3.5 text-sm text-muted-foreground">
            More coming soon
          </div>
        </div>
      </div>
    </section>
  );
}

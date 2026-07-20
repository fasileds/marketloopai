"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export type TestimonialItem = { quote: string; name: string; role: string };

export function TestimonialsGrid({ items }: { items: TestimonialItem[] }) {
  return (
    <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((t, index) => (
        <motion.figure
          key={t.name + index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          className="glass flex h-full flex-col justify-between rounded-2xl p-6"
        >
          <Quote className="size-5 text-primary/70" aria-hidden />
          <blockquote className="mt-4 flex-1 text-sm text-foreground/90">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-6 text-sm">
            <span className="font-medium">{t.name}</span>
            <span className="block text-muted-foreground">{t.role}</span>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

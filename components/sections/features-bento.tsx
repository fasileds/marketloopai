"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Clapperboard,
  Globe,
  Megaphone,
  Recycle,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { EditableText } from "@/components/editing/editable-text";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
};

const FEATURES_META: { icon: LucideIcon; className?: string }[] = [
  { icon: Wand2, className: "md:col-span-2" },
  { icon: Clapperboard },
  { icon: Globe },
  { icon: Recycle, className: "md:col-span-2" },
  { icon: Megaphone, className: "md:col-span-2" },
  { icon: BarChart3 },
  { icon: Users },
  { icon: Sparkles },
];

export function FeaturesBento({ items }: { items: { title: string; description: string }[] }) {
  const features: Feature[] = items.map((item, index) => ({
    ...item,
    icon: FEATURES_META[index].icon,
    className: FEATURES_META[index].className,
  }));

  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[100rem]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
              className={`glow-border glass group relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 ${feature.className ?? ""}`}
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <feature.icon className="size-5" aria-hidden />
              </div>
              <h3 className="text-base font-medium">
                <EditableText contentKey={`features.bento.${index}.title`} value={feature.title} />
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <EditableText
                  multiline
                  contentKey={`features.bento.${index}.description`}
                  value={feature.description}
                />
              </p>
              <div
                className="pointer-events-none absolute -bottom-16 -right-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                style={{ background: "var(--glow-primary)" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

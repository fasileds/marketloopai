"use client";

import { motion } from "framer-motion";
import { ChevronDown, PlayCircle } from "lucide-react";

import { EditableText } from "@/components/editing/editable-text";
import { Button } from "@/components/ui/button";

export type HeroStat = { value: string; label: string };

export function Hero({
  eyebrow,
  headlinePrefix,
  headlineHighlight,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  stats,
}: {
  eyebrow: string;
  headlinePrefix: string;
  headlineHighlight: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: HeroStat[];
}) {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pt-32 pb-20 sm:px-6">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="animate-aurora absolute left-1/2 top-[-20%] h-[70vh] w-[70vh] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle at center, var(--glow-primary), transparent 65%)",
          }}
        />
        <div
          className="animate-aurora absolute right-[-10%] top-[10%] h-[55vh] w-[55vh] rounded-full opacity-30 blur-[120px]"
          style={{
            background: "radial-gradient(circle at center, var(--glow-accent), transparent 65%)",
            animationDelay: "-8s",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="glass mb-6 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground"
      >
        <span className="size-1.5 rounded-full bg-primary" />
        <EditableText contentKey="home.hero.eyebrow" value={eyebrow} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
        className="max-w-4xl text-balance text-center text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
      >
        <EditableText contentKey="home.hero.headline_prefix" value={headlinePrefix} />{" "}
        <span className="text-gradient">
          <EditableText contentKey="home.hero.headline_highlight" value={headlineHighlight} multiline />
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
        className="mt-6 max-w-2xl text-balance text-center text-base text-muted-foreground sm:text-lg"
      >
        <EditableText contentKey="home.hero.subheadline" value={subheadline} multiline />
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
        className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
      >
        <Button
          size="lg"
          className="h-11 px-6 text-sm"
          nativeButton={false}
          render={<a href="#waitlist" />}
        >
          <EditableText contentKey="home.hero.cta_primary" value={ctaPrimary} />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-11 gap-2 px-6 text-sm"
          nativeButton={false}
          render={<a href="#product" />}
        >
          <PlayCircle className="size-4" aria-hidden />
          <EditableText contentKey="home.hero.cta_secondary" value={ctaSecondary} />
        </Button>
      </motion.div>

      <motion.dl
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-4 text-center"
      >
        {stats.map((stat, index) => (
          <div key={index}>
            <dt className="sr-only">{stat.label}</dt>
            <dd className="text-2xl font-semibold sm:text-3xl">
              <EditableText contentKey={`home.hero.stats.${index}.value`} value={stat.value} />
            </dd>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              <EditableText contentKey={`home.hero.stats.${index}.label`} value={stat.label} />
            </p>
          </div>
        ))}
      </motion.dl>

      <a
        href="#explore"
        aria-label="Scroll to explore the platform"
        className="absolute bottom-6 flex flex-col items-center gap-1 text-muted-foreground"
      >
        <span className="text-[11px] uppercase tracking-widest">Scroll</span>
        <ChevronDown className="size-4 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}

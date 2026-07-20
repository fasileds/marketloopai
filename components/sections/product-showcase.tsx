"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Laptop, Monitor, Smartphone, Tablet } from "lucide-react";
import { useState } from "react";

import { EditableText } from "@/components/editing/editable-text";

import { SectionHeading } from "./section-heading";

const DEVICES = [
  { id: "desktop", label: "Desktop", icon: Monitor, frame: "aspect-video max-w-3xl", bars: 4 },
  { id: "macbook", label: "MacBook", icon: Laptop, frame: "aspect-[16/10] max-w-3xl", bars: 4 },
  { id: "tablet", label: "Tablet", icon: Tablet, frame: "aspect-[4/3] max-w-xl", bars: 3 },
  { id: "phone", label: "Phone", icon: Smartphone, frame: "aspect-[9/16] max-w-[280px]", bars: 2 },
] as const;

function MockDashboard({ bars }: { bars: number }) {
  return (
    <div className="flex h-full w-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-yellow-500/60" />
          <span className="size-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="h-2 w-20 rounded-full bg-muted" />
      </div>
      <div className={`grid flex-1 gap-3 ${bars === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {Array.from({ length: bars }).map((_, i) => (
          <div key={i} className="glass rounded-lg p-3">
            <div className="h-2 w-3/4 rounded-full bg-primary/40" />
            <div className="mt-3 h-16 rounded-md bg-gradient-to-br from-primary/30 to-accent/20" />
          </div>
        ))}
      </div>
      <div className="glass flex h-16 items-center gap-3 rounded-lg px-4">
        <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2 w-1/3 rounded-full bg-muted" />
          <div className="h-2 w-1/2 rounded-full bg-muted/60" />
        </div>
      </div>
    </div>
  );
}

export function ProductShowcase({
  eyebrow,
  titlePrefix,
  titleHighlight,
  description,
}: {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
}) {
  const [active, setActive] = useState<(typeof DEVICES)[number]["id"]>("macbook");
  const device = DEVICES.find((d) => d.id === active)!;

  return (
    <section id="product" className="section-panel scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[100rem]">
        <SectionHeading
          eyebrow={<EditableText contentKey="home.product.eyebrow" value={eyebrow} />}
          title={
            <>
              <EditableText contentKey="home.product.title_prefix" value={titlePrefix} />{" "}
              <span className="text-gradient">
                <EditableText contentKey="home.product.title_highlight" value={titleHighlight} />
              </span>
            </>
          }
          description={
            <EditableText contentKey="home.product.description" value={description} multiline />
          }
        />

        <div className="mt-10 flex flex-wrap justify-center px-2">
          <div className="glass flex flex-wrap justify-center gap-1 rounded-full p-1">
            {DEVICES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActive(d.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-3.5 sm:text-sm ${
                  active === d.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <d.icon className="size-3.5" aria-hidden />
                <span className="hidden sm:inline">{d.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`glow-border glass noise-overlay w-full overflow-hidden rounded-2xl ${device.frame}`}
            >
              <MockDashboard bars={device.bars} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

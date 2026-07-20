"use client";

import { motion } from "framer-motion";
import { BarChart3, Brain, Globe2, Megaphone, Send, Sparkles, TrendingUp } from "lucide-react";

import { EditableHeading } from "@/components/editing/editable-heading";
import { EditableText } from "@/components/editing/editable-text";

import { SectionHeading } from "./section-heading";

const STEPS = [
  { title: "Website", description: "Connect your site as the source of truth.", icon: Globe2 },
  { title: "AI Analysis", description: "We learn your brand voice, offers, and audience.", icon: Brain },
  {
    title: "Generate",
    description: "Posts, videos, and ad creative generated automatically.",
    icon: Sparkles,
  },
  { title: "Publish", description: "Pushed to every channel, formatted and scheduled.", icon: Send },
  { title: "Launch Ads", description: "Campaigns go live across TikTok, Snap, X, Google.", icon: Megaphone },
  { title: "Analytics", description: "Unified performance data as it comes in.", icon: BarChart3 },
  { title: "Optimize", description: "AI reallocates spend toward what's working.", icon: TrendingUp },
];

export function Workflow({
  eyebrow,
  heading,
  description,
}: {
  eyebrow: string;
  heading: string;
  description: string;
}) {
  return (
    <section id="workflow" className="scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[100rem]">
        <SectionHeading
          eyebrow={<EditableText contentKey="home.workflow.eyebrow" value={eyebrow} />}
          title={<EditableHeading contentKey="home.workflow.heading" value={heading} />}
          description={
            <EditableText contentKey="home.workflow.description" value={description} multiline />
          }
        />

        <div className="relative mx-auto mt-16 max-w-2xl">
          <div className="absolute left-4 top-2 h-[calc(100%-1rem)] w-px bg-border" aria-hidden />
          <ol className="flex flex-col gap-10">
            {STEPS.map((step, index) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="relative flex items-start gap-4 pl-12"
              >
                <span className="glass absolute left-0 top-0 flex size-8 shrink-0 items-center justify-center rounded-full text-primary">
                  <step.icon className="size-4" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-medium">
                    <span className="mr-2 text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

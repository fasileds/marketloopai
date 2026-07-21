"use client";

import { motion } from "framer-motion";
import { BarChart3, Brain, Globe2, Megaphone, Send, Sparkles, TrendingUp } from "lucide-react";

import { EditableHeading } from "@/components/editing/editable-heading";
import { EditableText } from "@/components/editing/editable-text";

import { SectionHeading } from "./section-heading";

const STEPS = [
  {
    title: "Give us your idea",
    description: "Start with a sentence, a prompt, a product description, or content you already have.",
    icon: Globe2,
  },
  {
    title: "Generate multiple variations",
    description: "MarketLoopAI generates several distinct versions of your content — up to nine per post.",
    icon: Sparkles,
  },
  {
    title: "Humanize & evaluate",
    description: "Every version is scored for how natural, authentic, and human it feels, not just grammar.",
    icon: Brain,
  },
  {
    title: "Rank the best content",
    description: "Versions are ranked by humanization and quality score, so the strongest one surfaces first.",
    icon: TrendingUp,
  },
  {
    title: "Adapt for every platform",
    description:
      "The winning version is reshaped for LinkedIn, TikTok, Snapchat, X, Facebook, and Instagram — in each platform's own style.",
    icon: Send,
  },
  {
    title: "Create video or scene plans",
    description:
      "Generate a full AI video ad where supported, or get a scene-by-scene storyboard your team can shoot.",
    icon: BarChart3,
  },
  {
    title: "Launch and manage campaigns",
    description:
      "Organize your ad campaigns across TikTok Ads, Snapchat Ads, X Ads, Google Ads, and Facebook/Meta Ads.",
    icon: Megaphone,
  },
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

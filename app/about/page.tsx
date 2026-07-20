import type { Metadata } from "next";
import { Layers, Rocket, ShieldCheck, Users2 } from "lucide-react";

import { EditableHeading } from "@/components/editing/editable-heading";
import { EditableText } from "@/components/editing/editable-text";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { WaitlistCtaBand } from "@/components/sections/waitlist-cta-band";
import { getSiteContent, getText } from "@/lib/content/get-site-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "We're building MarketLoopAI to give every business an AI-powered marketing team — content, video, publishing, and ads in one platform.",
};

const VALUES = [
  {
    title: "Speed without sloppiness",
    description: "AI should make marketing faster, not lower quality. We optimize for both.",
    icon: Rocket,
  },
  {
    title: "One platform, not ten tabs",
    description:
      "Content, video, publishing, and ads shouldn't require a dozen disconnected tools.",
    icon: Layers,
  },
  {
    title: "Built with our users",
    description: "Every feature on our roadmap is shaped by direct feedback from early access partners.",
    icon: Users2,
  },
  {
    title: "Privacy by default",
    description: "Your brand data and content stay yours. We're built with security and control in mind from day one.",
    icon: ShieldCheck,
  },
];

const STATS = [
  { value: "2026", label: "Founded" },
  { value: "40+", label: "Planned integrations" },
  { value: "7", label: "Steps automated end-to-end" },
];

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <>
      <PageHero
        eyebrow={getText(content, "pagehero.about.eyebrow")}
        eyebrowKey="pagehero.about.eyebrow"
        title={getText(content, "pagehero.about.title")}
        titleKey="pagehero.about.title"
        description={getText(content, "pagehero.about.description")}
        descriptionKey="pagehero.about.description"
      />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[100rem] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-primary">
              <EditableText
                contentKey="about.story.eyebrow"
                value={getText(content, "about.story.eyebrow", "Our story")}
              />
            </span>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              <EditableHeading
                contentKey="about.story.title"
                value={getText(
                  content,
                  "about.story.title",
                  "Marketing teams are stretched across too many tools",
                )}
              />
            </h2>
            <div className="mt-5 space-y-4 text-muted-foreground">
              <p>
                <EditableText
                  multiline
                  contentKey="about.story.paragraph.0"
                  value={getText(
                    content,
                    "about.story.paragraph.0",
                    "Most businesses juggle a content tool, a video editor, a scheduler, and separate ad managers for every platform — and still struggle to keep up. We think that's backwards.",
                  )}
                />
              </p>
              <p>
                <EditableText
                  multiline
                  contentKey="about.story.paragraph.1"
                  value={getText(
                    content,
                    "about.story.paragraph.1",
                    "MarketLoopAI was started to build the platform we wished existed: point it at your website, and it understands your brand well enough to generate content, produce video, publish everywhere, and run ad campaigns — all from one place.",
                  )}
                />
              </p>
              <p>
                <EditableText
                  multiline
                  contentKey="about.story.paragraph.2"
                  value={getText(
                    content,
                    "about.story.paragraph.2",
                    "We're pre-launch and building in the open with a small group of early access partners shaping the roadmap. The waitlist is the best way to be part of that.",
                  )}
                />
              </p>
            </div>
          </div>

          <dl className="glass noise-overlay grid grid-cols-3 gap-4 rounded-2xl p-8">
            {STATS.map((stat, index) => {
              const value = getText(content, `about.stats.${index}.value`, stat.value);
              const label = getText(content, `about.stats.${index}.label`, stat.label);
              return (
                <div key={stat.label} className="text-center">
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-2xl font-semibold sm:text-3xl">
                    <EditableText contentKey={`about.stats.${index}.value`} value={value} />
                  </dd>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    <EditableText contentKey={`about.stats.${index}.label`} value={label} />
                  </p>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      <section className="section-panel px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[100rem]">
          <SectionHeading
            eyebrow={
              <EditableText
                contentKey="about.values.eyebrow"
                value={getText(content, "about.values.eyebrow", "Values")}
              />
            }
            title={
              <>
                What guides <span className="text-gradient">how we build</span>
              </>
            }
          />
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {VALUES.map((value, index) => {
              const title = getText(content, `about.values.${index}.title`, value.title);
              const description = getText(
                content,
                `about.values.${index}.description`,
                value.description,
              );
              return (
                <div key={value.title} className="glow-border glass relative overflow-hidden rounded-2xl p-6">
                  <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <value.icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="text-base font-medium">
                    <EditableText contentKey={`about.values.${index}.title`} value={title} />
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    <EditableText
                      multiline
                      contentKey={`about.values.${index}.description`}
                      value={description}
                    />
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <WaitlistCtaBand
        title={getText(content, "about.cta.title", "Want to help shape what we build next?")}
        titleKey="about.cta.title"
        description={getText(
          content,
          "about.cta.description",
          "Join the waitlist and you'll hear from us directly as new features ship.",
        )}
        descriptionKey="about.cta.description"
      />
    </>
  );
}

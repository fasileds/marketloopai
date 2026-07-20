import { createServiceRoleClient } from "@/lib/supabase/server";

import { SectionHeading } from "./section-heading";
import { TestimonialsGrid, type TestimonialItem } from "./testimonials-grid";

const FALLBACK: TestimonialItem[] = [
  {
    quote:
      "We tested the early access build against our usual content workflow and cut production time down to a fraction of what it used to take.",
    name: "Maya",
    role: "Founder, e-commerce skincare brand",
  },
  {
    quote:
      "Having one place to generate creative and manage ad spend across platforms is exactly what our team has been missing.",
    name: "Diego",
    role: "Head of Growth, B2B SaaS",
  },
  {
    quote:
      "The repurposing alone would save my agency dozens of hours a week across client accounts.",
    name: "Priya",
    role: "Founder, social media agency",
  },
];

async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("testimonials")
      .select("quote, author_name, author_role")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (!data || data.length === 0) return FALLBACK;

    return data.map((row) => ({
      quote: row.quote,
      name: row.author_name,
      role: row.author_role ?? "",
    }));
  } catch {
    return FALLBACK;
  }
}

export async function Testimonials() {
  const items = await getTestimonials();

  return (
    <section className="section-panel px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[100rem]">
        <SectionHeading
          eyebrow="Early access"
          title={
            <>
              Early feedback from our <span className="text-gradient">preview partners</span>
            </>
          }
          description="A small group of teams have been testing MarketLoopAI ahead of launch."
        />

        <TestimonialsGrid items={items} />
      </div>
    </section>
  );
}

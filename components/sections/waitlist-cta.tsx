"use client";

import { motion } from "framer-motion";

import { EditableHeading } from "@/components/editing/editable-heading";
import { EditableText } from "@/components/editing/editable-text";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

type WaitlistFormCopy = Parameters<typeof WaitlistForm>[0]["copy"];

export function WaitlistCta({
  heading,
  description,
  formCopy,
}: {
  heading: string;
  description: string;
  formCopy?: WaitlistFormCopy;
}) {
  return (
    <section id="waitlist" className="relative scroll-mt-24 overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-center">
        <div
          className="h-[50vh] w-[50vh] rounded-full opacity-30 blur-[120px]"
          style={{
            background: "radial-gradient(circle at center, var(--glow-primary), transparent 65%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          <EditableHeading contentKey="home.waitlist_cta.heading" value={heading} />
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-4 text-muted-foreground"
        >
          <EditableText contentKey="home.waitlist_cta.description" value={description} multiline />
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-10"
        >
          <WaitlistForm copy={formCopy} />
        </motion.div>
      </div>
    </section>
  );
}

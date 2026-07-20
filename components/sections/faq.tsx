import { EditableHeading } from "@/components/editing/editable-heading";
import { EditableText } from "@/components/editing/editable-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { SectionHeading } from "./section-heading";

export type FaqItem = { question: string; answer: string };

export function Faq({ heading, items }: { heading: string; items: FaqItem[] }) {
  return (
    <section id="faq" className="scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title={<EditableHeading contentKey="home.faq.heading" value={heading} />}
        />

        <Accordion className="glass noise-overlay mt-10 rounded-2xl px-6" defaultValue={["item-0"]}>
          {items.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <EditableText contentKey={`home.faq.items.${index}.question`} value={faq.question} />
              </AccordionTrigger>
              <AccordionContent>
                <EditableText
                  contentKey={`home.faq.items.${index}.answer`}
                  value={faq.answer}
                  multiline
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

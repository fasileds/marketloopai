import type { LegalSection } from "@/components/legal/legal-page";
import { getText, type SiteContentMap } from "@/lib/content/get-site-content";

export type RawLegalSection = {
  id: string;
  heading: string;
  content: (string | { list: string[] })[];
};

export function buildLegalSections(
  content: SiteContentMap,
  prefix: string,
  sections: RawLegalSection[],
): LegalSection[] {
  return sections.map((section) => {
    const headingKey = `${prefix}.section.${section.id}.heading`;
    return {
      id: section.id,
      heading: getText(content, headingKey, section.heading),
      headingKey,
      content: section.content.map((block, i) => {
        if (typeof block === "string") {
          const key = `${prefix}.section.${section.id}.body.${i}`;
          return { text: getText(content, key, block), key };
        }
        return {
          list: block.list.map((item, j) => {
            const key = `${prefix}.section.${section.id}.list.${i}.${j}`;
            return { text: getText(content, key, item), key };
          }),
        };
      }),
    };
  });
}

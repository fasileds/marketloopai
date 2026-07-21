import type { BlogStat, CaseStudyContent } from "@/lib/validations/blog";

export type PostTemplateProps = {
  title: string;
  category: string | null;
  authorName: string;
  dateLabel: string | null;
  coverImageUrl: string | null;
  excerpt: string | null;
  paragraphs: string[];
  galleryImageUrls: string[];
  stats: BlogStat[];
  caseStudy: CaseStudyContent;
};

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

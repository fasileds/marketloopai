import { z } from "zod";

export { slugify } from "@/lib/slug";

export const BLOG_TEMPLATES = [
  "editorial",
  "magazine",
  "minimal",
  "cover-gallery",
  "split-screen",
  "visual-story",
  "data-insights",
  "case-study",
  "modular",
] as const;
export type BlogTemplate = (typeof BLOG_TEMPLATES)[number];

export const blogStatSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(60),
  value: z.string().trim().min(1, "Value is required").max(40),
  description: z.string().trim().max(160).optional().or(z.literal("")),
});
export type BlogStat = z.infer<typeof blogStatSchema>;

export const caseStudySchema = z.object({
  client: z.string().trim().max(120).optional().or(z.literal("")),
  challenge: z.string().trim().max(2000).optional().or(z.literal("")),
  goals: z.string().trim().max(2000).optional().or(z.literal("")),
  strategy: z.string().trim().max(2000).optional().or(z.literal("")),
  implementation: z.string().trim().max(2000).optional().or(z.literal("")),
  results: z.string().trim().max(2000).optional().or(z.literal("")),
  testimonialQuote: z.string().trim().max(600).optional().or(z.literal("")),
  testimonialAuthor: z.string().trim().max(120).optional().or(z.literal("")),
  conclusion: z.string().trim().max(2000).optional().or(z.literal("")),
});
export type CaseStudyContent = z.infer<typeof caseStudySchema>;

export const blogPostSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(160),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().trim().max(300).optional().or(z.literal("")),
  content: z.string().trim().min(20, "Content must be at least 20 characters"),
  category: z.string().trim().max(60).optional().or(z.literal("")),
  authorName: z.string().trim().min(1).max(100),
  coverImageUrl: z.string().trim().url().optional().or(z.literal("")),
  galleryImageUrls: z.array(z.string().trim().url()).max(20),
  stats: z.array(blogStatSchema).max(12),
  caseStudy: caseStudySchema,
  template: z.enum(BLOG_TEMPLATES),
  published: z.boolean(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

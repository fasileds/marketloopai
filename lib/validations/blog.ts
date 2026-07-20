import { z } from "zod";

export { slugify } from "@/lib/slug";

function plainTextLength(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().length;
}

export const blogPostSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(160),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().trim().max(300).optional().or(z.literal("")),
  content: z
    .string()
    .trim()
    .refine((html) => plainTextLength(html) >= 20, "Content must be at least 20 characters"),
  category: z.string().trim().max(60).optional().or(z.literal("")),
  authorName: z.string().trim().min(1).max(100),
  coverImageUrl: z.string().trim().url().optional().or(z.literal("")),
  published: z.boolean(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

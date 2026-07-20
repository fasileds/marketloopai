import { z } from "zod";

export const legalPageSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(160),
  slug: z
    .string()
    .trim()
    .min(3, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  content: z.string().trim().min(20, "Content must be at least 20 characters"),
  published: z.boolean(),
});

export type LegalPageInput = z.infer<typeof legalPageSchema>;

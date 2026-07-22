import { z } from "zod";

export const PRODUCT_UPDATE_TEMPLATES = [
  "announcement",
  "changelog",
  "minimal",
  "milestone",
  "feature-spotlight",
  "newsletter",
  "roadmap-update",
  "big-reveal",
] as const;
export type ProductUpdateTemplate = (typeof PRODUCT_UPDATE_TEMPLATES)[number];

export const productUpdateSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(160),
  content: z.string().trim().min(20, "Content must be at least 20 characters"),
  template: z.enum(PRODUCT_UPDATE_TEMPLATES),
  coverImageUrl: z.string().trim().url().optional().or(z.literal("")),
});

export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

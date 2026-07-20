import { z } from "zod";

export const testimonialSchema = z.object({
  quote: z.string().trim().min(10, "Quote must be at least 10 characters").max(600),
  authorName: z.string().trim().min(1, "Author name is required").max(100),
  authorRole: z.string().trim().max(150).optional().or(z.literal("")),
  published: z.boolean(),
  sortOrder: z.number().int(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

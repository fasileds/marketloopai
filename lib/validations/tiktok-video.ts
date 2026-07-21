import { z } from "zod";

export const tiktokVideoCreateSchema = z.object({
  tiktokUrl: z
    .string()
    .trim()
    .url("Enter a valid TikTok video URL")
    .refine((url) => /tiktok\.com/i.test(url), "Must be a tiktok.com URL"),
  caption: z.string().trim().max(200).optional().or(z.literal("")),
});
export type TikTokVideoCreateInput = z.infer<typeof tiktokVideoCreateSchema>;

export const tiktokVideoUpdateSchema = z.object({
  caption: z.string().trim().max(200).optional().or(z.literal("")),
  customThumbnailUrl: z.string().trim().url().optional().or(z.literal("")),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});
export type TikTokVideoUpdateInput = z.infer<typeof tiktokVideoUpdateSchema>;

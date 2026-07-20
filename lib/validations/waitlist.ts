import { z } from "zod";

export const INTERESTED_FEATURES = [
  "AI Content Generation",
  "AI Video Generation",
  "Social Publishing",
  "Content Repurposing",
  "Ad Campaign Management",
  "Analytics & Insights",
] as const;

export const BUSINESS_TYPES = [
  "Shopify Store",
  "SaaS Company",
  "Personal Brand",
  "Agency",
  "Small Business",
  "Other",
] as const;

export const COMPANY_SIZES = [
  "Just me",
  "2-10",
  "11-50",
  "51-200",
  "200+",
] as const;

export const waitlistSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  website: z
    .string()
    .trim()
    .max(255)
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || /^([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(value.replace(/^https?:\/\//, "")),
      "Enter a valid website (e.g. yourbrand.com)",
    ),
  businessType: z.enum(BUSINESS_TYPES).optional(),
  companySize: z.enum(COMPANY_SIZES).optional(),
  monthlyAdSpend: z.string().trim().max(60).optional().or(z.literal("")),
  interestedFeatures: z.array(z.enum(INTERESTED_FEATURES)).optional(),
  country: z.string().trim().max(60).optional().or(z.literal("")),
  referredBy: z.string().trim().max(20).optional().or(z.literal("")),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

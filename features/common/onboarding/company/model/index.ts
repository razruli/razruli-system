import { z } from "zod";

export const CompanyFormSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(1, "Industry is required"),
  timezone: z.string().min(1, "Timezone is required"),
  workingHours: z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
    end: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  }),
});

export type CompanyFormData = z.infer<typeof CompanyFormSchema>;

export const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Retail",
  "Manufacturing",
  "Education",
  "Other",
];

export const TIMEZONES = [
  "UTC-12",
  "UTC-11",
  "UTC-10",
  "UTC-9",
  "UTC-8",
  "UTC-7",
  "UTC-6",
  "UTC-5",
  "UTC-4",
  "UTC-3",
  "UTC-2",
  "UTC-1",
  "UTC",
  "UTC+1",
  "UTC+2",
  "UTC+3",
  "UTC+4",
  "UTC+5",
  "UTC+6",
  "UTC+7",
  "UTC+8",
  "UTC+9",
  "UTC+10",
  "UTC+11",
  "UTC+12",
];

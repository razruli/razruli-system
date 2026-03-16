import { z } from "zod";

export const UploadFormSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }),
  fileName: z.string().min(1, "File name is required"),
});

export type UploadFormData = z.infer<typeof UploadFormSchema>;

export const ALLOWED_FILE_TYPES = [
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

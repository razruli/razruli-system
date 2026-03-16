import { z } from "zod";

export const ConfirmationSchema = z.object({
  confirmed: z.boolean().refine((val) => val === true, {
    message: "You must confirm to continue",
  }),
});

export type ConfirmationData = z.infer<typeof ConfirmationSchema>;

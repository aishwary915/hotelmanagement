import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Add your name."),
  hotel: z.string().trim().min(1, "Add your hotel or restaurant name."),
  phone: z
    .string()
    .trim()
    .refine((p) => p.replace(/\D/g, "").length >= 10, "Add a 10-digit WhatsApp number."),
  website: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

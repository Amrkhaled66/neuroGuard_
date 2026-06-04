import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or less"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message must be 2000 characters or less"),
});

export type CreateNotificationFormValues = z.infer<
  typeof createNotificationSchema
>;

export type CreateNotificationPayload = CreateNotificationFormValues;

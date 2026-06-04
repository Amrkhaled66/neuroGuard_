import { z } from "zod";

export const addSessionSchema = z.object({
  duration: z
    .number({ error: "Duration must be a number" })
    .int("Duration must be a whole number")
    .min(1, "Duration is required"),
  channelCount: z
    .number({ error: "Channel count must be a number" })
    .int("Channel count must be a whole number")
    .min(1, "Channel count is required"),
  note: z
    .string()
    .trim()
    .max(500, "Note must be 500 characters or less")
    .optional(),
  sessionFile: z.custom<File>(
    (value) => value instanceof File,
    "EEG file is required",
  ),
});

export type AddSessionFormValues = z.infer<typeof addSessionSchema>;

export type CreateSessionPayload = AddSessionFormValues & {
  patientId: number;
};

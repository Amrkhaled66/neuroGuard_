import { z } from "zod";

export const addPatientMedicationSchema = z.object({
  medicationId: z.number().int("Medication is required"),
  dosage: z.string().trim().optional(),
  frequency: z.string().trim().optional(),
  instruction: z.string().trim().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  status: z.enum(["active", "discontinued"]),
});

export type AddPatientMedicationFormValues = z.infer<typeof addPatientMedicationSchema>;

export const updatePatientMedicationSchema = addPatientMedicationSchema.partial();

export type UpdatePatientMedicationFormValues = z.infer<typeof updatePatientMedicationSchema>;

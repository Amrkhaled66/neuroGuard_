import { z } from "zod";

export const medicationForms = [
  "tablet",
  "capsule",
  "liquid",
  "injection",
  "other",
] as const;

export type MedicationForm = (typeof medicationForms)[number];

const optionalTextField = z.string().trim().optional();

export const patientMedicationPayloadSchema = z.object({
  medicationId: z.number().int("Medication is required").min(1, "Medication is required"),
  dosage: optionalTextField,
  frequency: optionalTextField,
  instruction: optionalTextField,
  startDate: z.string().min(1, "Start date is required"),
  endDate: optionalTextField,
  status: z.enum(["active", "discontinued"]),
});

export type PatientMedicationMutationPayload = z.infer<
  typeof patientMedicationPayloadSchema
>;

export const addPatientMedicationSchema = patientMedicationPayloadSchema
  .extend({
    medicationSource: z.enum(["existing", "new"]),
    medicationId: z.number().int().optional(),
    newMedicationName: optionalTextField,
    newMedicationForm: z.enum(medicationForms).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.medicationSource === "existing" && (!value.medicationId || value.medicationId < 1)) {
      ctx.addIssue({
        code: "custom",
        path: ["medicationId"],
        message: "Medication is required",
      });
    }

    if (value.medicationSource === "new" && !value.newMedicationName) {
      ctx.addIssue({
        code: "custom",
        path: ["newMedicationName"],
        message: "Medication name is required",
      });
    }

    if (value.medicationSource === "new" && !value.newMedicationForm) {
      ctx.addIssue({
        code: "custom",
        path: ["newMedicationForm"],
        message: "Medication form is required",
      });
    }
  });

export type AddPatientMedicationFormValues = z.infer<typeof addPatientMedicationSchema>;

export const updatePatientMedicationSchema = patientMedicationPayloadSchema.partial();

export type UpdatePatientMedicationFormValues = z.infer<typeof updatePatientMedicationSchema>;

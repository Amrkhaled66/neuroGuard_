import { z } from "zod";

export const addPatientSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email"),
  medicalId: z.string().trim().min(1, "Medical ID is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  gender: z.enum(["male", "female"]),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AddPatientFormValues = z.infer<typeof addPatientSchema>;
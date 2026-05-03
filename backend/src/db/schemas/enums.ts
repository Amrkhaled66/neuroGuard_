// src/db/enums.ts
import { pgEnum } from 'drizzle-orm/pg-core';

export const patientStatusEnum = pgEnum('patient_status', [
  'stable',
  'monitoring',
  'critical',
] as const);

export const genderEnum = pgEnum('gender', ['male', 'female'] as const);

export const formEnum = pgEnum('form', [
  'tablet',
  'capsule',
  'liquid',
  'injection',
  'other',
]);

export const statusEnum = pgEnum('status', [
  'scheduled',
  'taken',
  'missed',
] as const);

export const patientMedicationStatusEnum = pgEnum('patient_medication_status', [
  'active',
  'discontinued',
] as const);

import {
  pgTable as table,
  varchar,
  integer,
  date,
  text,
  index,
} from 'drizzle-orm/pg-core';
import { patients } from './patients.schema';
import { medications } from './medications.schema';
import { patientMedicationStatusEnum } from './enums';

export const patientMedications = table(
  'patient_medications',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    patientId: integer('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    medicationId: integer('medication_id')
      .notNull()
      .references(() => medications.id, { onDelete: 'restrict' }),
    dosage: varchar(),
    frequency: varchar(),
    instruction: text(),
    startDate: date('start_date'),
    endDate: date('end_date'),
    status: patientMedicationStatusEnum('status').default('active'),
  },
  (table) => [
    index('patient_medications_patient_id_idx').on(table.patientId),
    index('patient_medications_medication_id_idx').on(table.medicationId),
  ],
);

export type PatientMedication = typeof patientMedications.$inferSelect;

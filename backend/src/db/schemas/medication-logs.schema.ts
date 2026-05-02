import { pgTable as table, varchar, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { patientMedications } from './patient-medications.schema';
import { statusEnum } from './enums';
export const medicationLogs = table(
  'medication_logs',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    patientMedicationId: integer('patient_medication_id')
      .notNull()
      .references(() => patientMedications.id, { onDelete: 'cascade' }),
    status: statusEnum('status').notNull(),
    takenAt: timestamp('taken_at'),
  },
  (table) => [
    index('medication_logs_patient_medication_id_idx').on(table.patientMedicationId),
  ]
);

export type MedicationLog = typeof medicationLogs.$inferSelect;
export type NewMedicationLog = typeof medicationLogs.$inferInsert;

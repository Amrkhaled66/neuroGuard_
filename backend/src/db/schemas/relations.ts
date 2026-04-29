import { relations } from 'drizzle-orm';
import { doctors } from './doctors.schema';
import { patients } from './patients.schema';

export const doctorsRelations = relations(doctors, ({ many }) => ({
  patients: many(patients),
}));

export const patientsRelations = relations(patients, ({ one }) => ({
  doctor: one(doctors, {
    fields:     [patients.doctorId],
    references: [doctors.id],
  }),
}));
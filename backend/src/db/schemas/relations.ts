import { relations } from 'drizzle-orm';
import { doctors } from './doctors.schema';
import { patients } from './patients.schema';
import { medications } from './medications.schema';
import { patientMedications } from './patient-medications.schema';
import { medicationLogs } from './medication-logs.schema';
import { sessions } from './sessions.schema';
import { seizureEvents } from './seizure-events.schema';
import { notifications } from './notifications.schema';

export const doctorsRelations = relations(doctors, ({ many }) => ({
  patients: many(patients),
  medications: many(medications),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  doctor: one(doctors, {
    fields:     [patients.doctorId],
    references: [doctors.id],
  }),
  patientMedications: many(patientMedications),
  sessions: many(sessions),
  notifications: many(notifications),
}));

export const medicationsRelations = relations(medications, ({ one, many }) => ({
  doctor: one(doctors, {
    fields: [medications.doctorId],
    references: [doctors.id],
  }),
  patientMedications: many(patientMedications),
}));

export const patientMedicationsRelations = relations(patientMedications, ({ one, many }) => ({
  patient: one(patients, {
    fields: [patientMedications.patientId],
    references: [patients.id],
  }),
  medication: one(medications, {
    fields: [patientMedications.medicationId],
    references: [medications.id],
  }),
  logs: many(medicationLogs),
}));

export const medicationLogsRelations = relations(medicationLogs, ({ one }) => ({
  patientMedication: one(patientMedications, {
    fields: [medicationLogs.patientMedicationId],
    references: [patientMedications.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  patient: one(patients, {
    fields: [sessions.patientId],
    references: [patients.id],
  }),
  seizureEvents: many(seizureEvents),
}));

export const seizureEventsRelations = relations(seizureEvents, ({ one }) => ({
  session: one(sessions, {
    fields: [seizureEvents.sessionId],
    references: [sessions.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  patient: one(patients, {
    fields: [notifications.userId],
    references: [patients.id],
  }),
}));

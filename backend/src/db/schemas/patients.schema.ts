import { pgTable as table, varchar, date, integer, text } from 'drizzle-orm/pg-core';
import baseColumns from '../baseColumns';
import { doctors } from './doctors.schema';
import { genderEnum } from './enums';
import { patientStatusEnum } from './enums';
export const patients = table('patients', {
  ...baseColumns,
    email: text().notNull().unique(),
  
  medicalId: varchar('medical_id').notNull().unique(),
  doctorId: integer('doctor_id')
    .notNull()
    .references(() => doctors.id, { onDelete: 'cascade' }),
  birthDate: date('birth_date').notNull(),
  status: patientStatusEnum('status').default('stable'),
  gender: genderEnum('gender'),
});

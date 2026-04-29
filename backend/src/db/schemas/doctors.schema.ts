import { pgTable as table, text, varchar } from 'drizzle-orm/pg-core';
import baseColumns from '../baseColumns';

export const doctors = table('doctors', {
  ...baseColumns,
  email: text().notNull().unique(),

  clinicName: varchar('clinic_name', { length: 255 }).notNull(),
});

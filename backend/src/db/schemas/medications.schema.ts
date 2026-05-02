import {
  pgTable as table,
  varchar,
  integer,
  index,
} from 'drizzle-orm/pg-core';
import { doctors } from './doctors.schema';

import { formEnum } from './enums';

export const medications = table(
  'medications',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    doctorId: integer('doctor_id')
      .notNull()
      .references(() => doctors.id, { onDelete: 'cascade' }),
    name: varchar().notNull(),
    form: formEnum('form').notNull(),
  },
  (table) => [index('medications_doctor_id_idx').on(table.doctorId)],
);

export type Medication = typeof medications.$inferSelect;

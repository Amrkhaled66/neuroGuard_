import {
  integer,
  pgTable as table,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { date } from 'drizzle-orm/pg-core';

export const genderEnum = pgEnum('gender', ['male', 'female'] as const);

export const patients = table('patients', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  medicalId: varchar('medical_id').notNull(),
  birthDate: date('birth_date').notNull(),
  gender: genderEnum('gender'),
});

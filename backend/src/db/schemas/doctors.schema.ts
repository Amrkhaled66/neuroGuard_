import { pgTable as table, integer, varchar } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const doctors = table('doctors', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),

  clinicName: varchar('clinic_name', { length: 255 }),
});

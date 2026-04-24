import {
  pgTable as table,
  integer,
  text,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const rolesEnum = pgEnum('role', ['patient', 'doctor'] as const);

export const users = table('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text().notNull().unique(),
  role: rolesEnum('role').notNull(),
  password: text().notNull(),
});

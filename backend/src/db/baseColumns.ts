import {
  integer,
  text,
  varchar,
} from 'drizzle-orm/pg-core';


const baseColumns = {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar('first_name').notNull(),
  lastName: text('last_name').notNull(),
  password: text().notNull(),
};
export default baseColumns;

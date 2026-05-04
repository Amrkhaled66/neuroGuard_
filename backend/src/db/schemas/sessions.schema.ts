import {
  pgTable as table,
  varchar,
  integer,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { patients } from './patients.schema';

export const sessions = table('sessions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  filePath: varchar('file_path'),
  duration: integer().notNull(),
  status: varchar().notNull(),
  note: text(),
  channelCount: integer('channel_count').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

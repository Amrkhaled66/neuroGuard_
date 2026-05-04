import { pgTable as table, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { sessions } from './sessions.schema';

export const seizureEvents = table('seizure_events', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: integer('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  onsetSide: varchar('onset_side'),
  onsetRegion: varchar('onset_region'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

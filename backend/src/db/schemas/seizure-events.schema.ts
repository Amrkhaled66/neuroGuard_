import { pgTable as table, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { sessions } from './sessions.schema';

export const seizureEvents = table('seizure_events', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: integer('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  onsetSide: varchar('onset_side'),
  onsetRegion: varchar('onset_region'),
  startTimeSeconds: integer('start_time_seconds').notNull(),
  endTimeSeconds: integer('end_time_seconds').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

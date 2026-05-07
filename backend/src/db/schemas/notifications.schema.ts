import {
  boolean,
  index,
  integer,
  pgTable as table,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { patients } from './patients.schema';

export const notifications = table(
  'notifications',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer('user_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    title: varchar().notNull(),
    message: text().notNull(),
    isRead: boolean('is_read').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    readAt: timestamp('read_at'),
  },
  (table) => [
    index('notifications_user_id_idx').on(table.userId),
    index('notifications_created_at_idx').on(table.createdAt),
  ],
);

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

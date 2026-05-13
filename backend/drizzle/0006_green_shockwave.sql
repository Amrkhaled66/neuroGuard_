ALTER TABLE "seizure_events" ADD COLUMN "start_time_seconds" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "seizure_events" ADD COLUMN "end_time_seconds" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "seizure_events" DROP COLUMN "start_time";--> statement-breakpoint
ALTER TABLE "seizure_events" DROP COLUMN "end_time";
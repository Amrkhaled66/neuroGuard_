-- Custom SQL migration file, put your code below! --
ALTER TABLE "seizure_events"
ADD COLUMN "start_time_seconds" integer,
ADD COLUMN "end_time_seconds" integer;
--> statement-breakpoint
UPDATE "seizure_events"
SET
  "start_time_seconds" = EXTRACT(EPOCH FROM "start_time")::integer,
  "end_time_seconds" = EXTRACT(EPOCH FROM "end_time")::integer;
--> statement-breakpoint
ALTER TABLE "seizure_events"
ALTER COLUMN "start_time_seconds" SET NOT NULL,
ALTER COLUMN "end_time_seconds" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "seizure_events"
DROP COLUMN "start_time",
DROP COLUMN "end_time";

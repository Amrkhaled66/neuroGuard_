CREATE TYPE "public"."patient_status" AS ENUM('stable', 'monitoring', 'critical');--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "status" "patient_status" DEFAULT 'stable';
CREATE TYPE "public"."form" AS ENUM('tablet', 'capsule', 'liquid', 'injection', 'other');--> statement-breakpoint
CREATE TYPE "public"."patient_medication_status" AS ENUM('active', 'discontinued');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('scheduled', 'taken', 'missed');--> statement-breakpoint
CREATE TABLE "medication_logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "medication_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"patient_medication_id" integer NOT NULL,
	"status" "status" NOT NULL,
	"taken_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "medications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "medications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"doctor_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"form" "form" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_medications" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "patient_medications_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"patient_id" integer NOT NULL,
	"medication_id" integer NOT NULL,
	"dosage" varchar,
	"frequency" varchar,
	"instruction" text,
	"start_date" date,
	"end_date" date,
	"status" "patient_medication_status" DEFAULT 'active'
);
--> statement-breakpoint
ALTER TABLE "medication_logs" ADD CONSTRAINT "medication_logs_patient_medication_id_patient_medications_id_fk" FOREIGN KEY ("patient_medication_id") REFERENCES "public"."patient_medications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_medications" ADD CONSTRAINT "patient_medications_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_medications" ADD CONSTRAINT "patient_medications_medication_id_medications_id_fk" FOREIGN KEY ("medication_id") REFERENCES "public"."medications"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "medication_logs_patient_medication_id_idx" ON "medication_logs" USING btree ("patient_medication_id");--> statement-breakpoint
CREATE INDEX "medications_doctor_id_idx" ON "medications" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX "patient_medications_patient_id_idx" ON "patient_medications" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "patient_medications_medication_id_idx" ON "patient_medications" USING btree ("medication_id");
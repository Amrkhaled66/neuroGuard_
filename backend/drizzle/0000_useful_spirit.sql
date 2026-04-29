CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TABLE "doctors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "doctors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar NOT NULL,
	"last_name" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"clinic_name" varchar(255) NOT NULL,
	CONSTRAINT "doctors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "patients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar NOT NULL,
	"last_name" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"medical_id" varchar NOT NULL,
	"doctor_id" integer NOT NULL,
	"birth_date" date NOT NULL,
	"gender" "gender",
	CONSTRAINT "patients_email_unique" UNIQUE("email"),
	CONSTRAINT "patients_medical_id_unique" UNIQUE("medical_id")
);
--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
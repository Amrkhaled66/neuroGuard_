Please create Drizzle schemas for these database tables:

1. medications
2. patient_medications
3. medication_logs

Use the same style as the existing project schemas.

Requirements:

- Use `pgTable` from `drizzle-orm/pg-core`.
- Use PostgreSQL-compatible column types.
- Use `integer(...).primaryKey().generatedAlwaysAsIdentity()` for auto-increment IDs.
- Use snake_case database column names.
- Use camelCase TypeScript property names.
- Add foreign key references:
  - `patient_medications.patient_id` references `patients.id`
  - `patient_medications.medication_id` references `medications.id`
  - `medication_logs.patient_medication_id` references `patient_medications.id`
- Use `{ onDelete: "cascade" }` for patient-related dependent data.
- Use `{ onDelete: "restrict" }` or `{ onDelete: "set null" }` for medication catalog references if appropriate.
- Add indexes on foreign key columns.
- Export insert/select types using Drizzle helpers if the project already uses them.
- Keep the schemas clean and scalable.

DBML structure to convert:

Table medications {
id int [pk, increment]
name varchar [not null]
form varchar
}

Table patient_medications {
id int [pk, increment]
patient_id int [not null, ref: > patients.id]
medication_id int [not null, ref: > medications.id]
dosage varchar
frequency varchar
instruction text
start_date date
end_date date
status varchar
}

Table medication_logs {
id int [pk, increment]
patient_medication_id int [not null, ref: > patient_medications.id]
status varchar
taken_at datetime
}

Please generate at backend/src/db/schemas:

1. `medications.schema.ts`
2. `patient-medications.schema.ts`
3. `medication-logs.schema.ts`

Also update the central schema export file if the project has one, for example:

```ts
export * from "./medications.schema";
export * from "./patient-medications.schema";
export * from "./medication-logs.schema";
```

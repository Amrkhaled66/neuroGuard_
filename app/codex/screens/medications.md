# Create Medication Feature

Create a new frontend feature called `medication`.

Before implementation, study the existing frontend structure and follow the same patterns used in the project.

Also study the backend schemas related to:

- `medications`
- `patient_medications`
- `medication_logs`

Use this understanding to shape the mock data, types, hooks, and future API integration.

## Goal

Build the Patient Medication screen.

The screen should help the patient quickly understand:

- what medication they need to take today
- what dose is next
- what they already took
- what is still remaining
- what medications are currently active

## Styling

Follow the same visual style used in the existing app, especially the Home screen and `login.tsx`.

Do not introduce a new color system.

The UI should feel calm, clean, medical, and easy to scan.

## UI Description

Use a clean vertical `ScrollView`.

The page should include these sections:

### 1. Header

Show:

- title: `Medication`
- subtitle: `Track your daily treatment plan`

Keep it simple and friendly.

### 2. Today Summary Card

Show a quick overview of today’s medication progress.

Content example:

- `Today’s Medication`
- `2 of 3 taken`
- `1 remaining`
- progress bar or simple progress indicator

This card should give the patient a quick summary.

### 3. Next Dose Card

This is the main action card.

Content example:

- `Next Dose`
- `Keppra 500mg`
- `Today, 9:00 PM`
- `After food`
- button: `Mark as Taken`

The button should be clear and easy to tap.

### 4. Today Schedule

Show today’s medication doses as a list.

Each item should show:

- time
- medication name
- dosage
- instruction
- status

Example:

- `9:00 AM — Keppra 500mg — Taken`
- `2:00 PM — Depakine 250mg — Missed`
- `9:00 PM — Keppra 500mg — Scheduled`

Use simple status badges:

- `Taken`
- `Scheduled`
- `Missed`

If the dose is scheduled, show a `Mark as Taken` action.

### 5. Active Medications

Show the patient’s active medications.

Each card should show:

- medication name
- dosage
- frequency
- instruction
- start date
- end date if available
- status

Example:

- `Keppra`
- `500mg`
- `Twice daily`
- `After food`
- `Active`

## Architecture

Use feature-based architecture.

Build the screen as reusable components with single responsibility.

Suggested components:

- `MedicationHeader`
- `TodayMedicationSummaryCard`
- `NextDoseCard`
- `TodayScheduleList`
- `MedicationDoseItem`
- `ActiveMedicationCard`
- `ActiveMedicationsList`

Each component should do one thing only.

The screen should only compose components and pass data.

## Data

Use clean mock data if API endpoints are not ready.

Do not hardcode data directly inside UI components.

Create types that match future backend integration.

Suggested statuses:

```ts
type MedicationLogStatus = "scheduled" | "taken" | "missed";
type PatientMedicationStatus = "active" | "discontinued";
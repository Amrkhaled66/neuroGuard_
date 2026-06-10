# Create Home Feature

Create a new frontend feature called `home`.

Before implementation, study the existing frontend structure and follow the same patterns used in the project.

Also study the backend schemas and existing backend structure to understand how the Home screen will later integrate with real data. from the backend and schemas folder

## Goal

Build the Patient Home Dashboard screen after login.

The screen should help the patient quickly understand:

- current health status
- next medication
- today medication progress
- latest session update
- recent doctor/system update

## Styling

Follow the same colors, spacing, typography, inputs, cards, and general visual direction used in `login.tsx`.

Do not introduce a new color system.

## UI Description

The Home screen should be a clean vertical mobile dashboard.

Use a `View` with safe spacing.

The screen should look calm, medical, modern, and easy to scan.

### 1. Header

At the top, show:

- greeting: `Good morning, Ahmed`
- subtitle: `Here’s your health summary for today`
- small profile/avatar icon or button on the right

The header should feel friendly and not crowded.


### 2. Next Medication Card

This is the most important action card.

Content:

- title: `Next Medication`
- medication: `Keppra 500mg`
- time: `Today, 9:00 PM`
- instruction: `After food`
- button: `Mark as Taken`

The button should be very clear and easy to tap.

### 4. Today Progress Card

Show medication progress for today.

Content:

- title: `Today’s Progress`
- text: `2 of 3 medications taken`
- small text: `1 remaining`
- progress bar or simple visual progress indicator

This card should feel encouraging.

### 5. Latest Session Card

Show latest medical session summary.

Content:

- title: `Latest Session`
- date: `June 8, 2026`
- status: `Reviewed`
- duration: `45 min`
- events: `2 events found`
- link/button: `View details`

Keep it simple and not too technical.

### 6. Recent Update Card

Show latest doctor/system update.

Content:

- title: `Recent Update`
- message: `Your doctor reviewed your latest session. Please continue your medication and upload your next session on Friday.`

The card should feel supportive, not scary.

## Architecture

Use feature-based architecture.

The `home` feature should be built as a group of reusable components with single responsibility.

Suggested components:

- `HomeHeader`
- `NextMedicationCard`
- `TodayProgressCard`
- `LatestSessionCard`
- `RecentUpdateCard`

Each component should do one thing only.

The screen should only compose components and pass data to them.

## Tabs

Create the patient tabs in the layout using native tabs.

Tabs should include:

- Home
- Medication
- Sessions
- Seizures
- Alerts

Home should be the first active tab.

For now, create placeholders for the other tabs only if needed.

## Data

Use clean mock data if API endpoints are not ready.

But structure the code so it can later connect to backend data using hooks/services.

Do not hardcode everything directly inside UI components.

## Backend Study

Before implementation, study the backend schemas related to:

- patients
- medications
- patient medications
- medication logs
- sessions
- seizure events
- notifications

Use this understanding to shape the mock data and frontend types.

## Agent Tasks

1. Review frontend folder structure.
2. Review backend schemas for future integration.
3. Create `home` feature following existing project conventions.
4. Build the Home screen as reusable single-responsibility components.
5. Add Home screen to native tabs layout.
6. Follow the same visual style as `login.tsx`.
7. Do not implement full Medication, Sessions, Seizures, or Alerts screens yet.
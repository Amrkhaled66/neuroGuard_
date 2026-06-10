# Patient Dashboard Init

## 1. Project Context

We are building the **Patient Dashboard** for a React Native medical app.

The app is focused on:

- patient health status
- seizure/session monitoring
- medication tracking
- doctor updates
- patient notifications

This file is only the **starting brief**.  
Do not implement the dashboard yet before reviewing the current frontend structure.

---

## 2. Main Goal

Build a calm, clear, and useful dashboard for the patient.

The patient should quickly understand:

- their current status
- next medication
- today’s medication progress
- latest session update
- recent alerts or doctor messages

The dashboard should feel:

- simple
- safe
- medical
- trustworthy
- easy to scan
- not alarming

---

## 3. Architecture Direction

We will use a **feature-based architecture**.

Before creating any new folder or file, review the existing frontend structure and follow the same patterns already used in the project.

Do not create a new structure that conflicts with the current app.

---

## 4. Mandatory Frontend Review

Before coding, inspect the frontend folder and study how the app is currently organized.

Review things like:

```txt
frontend/
├── app/
├── features/
├── shared/
├── components/
├── hooks/
├── services/
├── api/
├── constants/
└── navigation / routing setup
```

Focus on understanding:

- how features are structured
- how screens are named
- how components are organized
- how API calls are written
- how Axios is configured
- how React Query hooks are created
- how navigation is handled
- how theme/colors are managed
- what reusable UI components already exist

---

## 5. Libraries

Use the existing project setup.

Planned libraries:

- React Native
- Axios
- React Query
- Existing navigation solution
- Existing shared UI/theme system

Do not add new libraries unless clearly needed and approved.

---

## 6. Color Palette

Use this palette for the patient dashboard:

```css
--brand-primary: #82d7b1;
--brand-primary-hover: #9ef4cc;
--brand-primary-soft: rgba(130, 215, 177, 0.16);
--brand-primary-softest: rgba(94, 220, 175, 0.18);
--brand-secondary: #0e3b31;
--brand-secondary-soft: #1b5d4a;
```

Use the palette in a calm medical way:

- primary color for buttons, active states, icons, and highlights
- secondary color for titles and strong text
- soft colors for cards, backgrounds, and badges

---

## 7. Planned Patient Dashboard Screens

We will build these screens later:

```txt
1. Patient Home
2. Medication
3. Sessions
4. Seizures
5. Alerts
```

The first screen we will start with is:

```txt
Patient Home Dashboard
```

---

## 8. Expected Output Before Coding

Before implementation, return a short analysis of the current frontend folder.

The response should include:

- current frontend architecture summary
- where the patient dashboard feature should be placed
- suggested folder structure based on the existing project
- existing reusable components we should use
- existing API and React Query patterns
- any warnings or conflicts found

After this review, we will continue with the actual implementation plan.

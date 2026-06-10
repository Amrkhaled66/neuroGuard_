# Entry Flow: Splash and Login

## Purpose

This file defines the first app entry flow for the React Native frontend.

We are not starting with the patient dashboard yet.  
The correct app flow is:

```txt
Splash Screen
→ Login Screen
→ Patient Dashboard
```

## Main Goal

Build the **Splash Screen** and **Login Screen** using the existing frontend style and architecture.

---

## Required Flow

```txt
App starts
→ Splash Screen appears
→ Check auth state/token if available
→ If authenticated: go to Patient Dashboard
→ If not authenticated: go to Login Screen
```

If auth/token logic is not ready yet, create the screen structure and keep the auth-check logic prepared in a clean hook/service pattern.

---

# 1. Splash Screen

## Goal

The splash screen should introduce the app brand and prepare the routing decision.

## UI Requirements

The splash screen must have:

```txt
Background color: brand primary
Logo: assets/images/logo.png
```

Use the brand primary color as the full screen background:

```css
#82d7b1
```

The logo should be centered vertically and horizontally.

Suggested layout:

```txt
SafeAreaView / View
└── Centered Logo Image
```

The screen should be clean and minimal.

No extra text is required unless already used in the app style.

---

## Splash Screen Design

Use:

```txt
backgroundColor: #82d7b1
logo source: @assets/images/logo.png
resizeMode: contain
```

Expected visual:

```txt
Full green screen
Centered NeuroGuard logo
Optional subtle loading indicator below logo if needed
```

Do not make the splash screen crowded.

---

## Splash Technical Requirements

The agent should create a splash screen using the same screen pattern already used in the frontend.

Possible file names, depending on current structure:

```txt
features/auth/screens/SplashScreen.tsx
```

or if the existing app uses route folders:

```txt
app/splash.tsx
```

The agent must decide after reviewing the project.

Auth-check logic should be separated into a hook or service if this matches the existing architecture.

Possible hook:

```txt
features/auth/hooks/useAuthBootstrap.ts
```

Possible responsibility:

```txt
- check stored token/session
- decide next route
- navigate to login or dashboard
```

Do not hardcode navigation logic directly inside UI if the current app separates logic into hooks.

---

# 2. Login Screen

## Goal

Create the login screen for the app entry flow.

The login screen should follow the existing frontend folder structure and reuse existing UI components if available.

---

## Login UI Requirements

The login screen should be like the one in frontend frontend/src/pages/patientsigninpage.tsx

```txt
Welcome back
Log in to continue monitoring your health
medicalid input
Password input
Login button
---

## Login Behavior

Expected behavior:

```txt
1. User enters medicalid and password
2. User taps Login
3. Validate required fields
4. Call login API/service
5. Store auth token/session if returned
6. Redirect user based on role
```

Possible redirect:

```txt
patient → Patient Dashboard
doctor → Doctor Dashboard
```

If role routing is not ready yet, redirect authenticated users to the Patient Dashboard for this phase.

---

## Login States

The screen must support:

```txt
idle
loading
success
error
```

Button labels:

```txt
Default: Login
Loading: Logging in...
```

Disable the login button while loading.

---

## Validation Messages

Use patient-friendly error messages.

Good:

```txt
Please enter your email.
Please enter your password.
Invalid email or password.
```

Avoid technical errors.

Bad:

```txt
401 Unauthorized
Request failed with status code 401
```

---

# 3. Auth Feature Structure

Use feature-based architecture.

Recommended structure only if it matches the existing project:

```txt
features/
└── auth/
    ├── api/
    │   ├── auth.api.ts
    │   └── auth.keys.ts
    │
    ├── hooks/
    │   ├── useLogin.ts
    │   └── useAuthBootstrap.ts
    │
    ├── screens/
    │   └── LoginScreen.tsx
    │
    ├── services/
    │   └── auth-storage.service.ts
    │
    ├── types/
    │   └── auth.types.ts
    │
    └── components/
        └── AuthHeader.tsx
```

Important:

The agent must first inspect the existing frontend folder.  
If another pattern already exists, follow the current project pattern instead of this suggested one.

---

# 4. Hooks and Services Requirement

The auth flow should not be written as one large screen file.

Use hooks and services based on the existing frontend style.

Expected responsibilities:

## Login screen

Responsible for:

```txt
- rendering UI
- collecting email/password
- showing loading/error states
- calling login hook
```

## useLogin hook

Responsible for:

```txt
- calling login API
- handling mutation state
- storing token/session if needed
- triggering navigation after success
```

## auth API/service

Responsible for:

```txt
- sending login request
- returning typed response
```

## auth storage service

Responsible for:

```txt
- saving token
- reading token
- removing token
```

Use the existing storage method if already present.

---

# 5. Axios and React Query

Use the existing API client if available.

Do not create a new Axios instance before checking the current frontend.

Expected pattern:

```txt
auth.api.ts
→ useLogin.ts
→ LoginScreen.tsx
```

If the project uses React Query mutations, use:

```txt
useMutation
```

If the project already has another mutation pattern, follow it.

---

# 6. Assets

The splash screen logo is located at:

```txt
assets/images/logo.png
```

Import it using the alias after alias setup:

```ts
import logo from '@assets/images/logo.png';
```

If the alias is not ready yet, the agent should configure it first.

---

# 7. images.d.ts

Create an `images.d.ts` file if the project does not already have one.

Purpose:

Allow TypeScript to import image assets like PNG/JPG.

Suggested file:

```txt
images.d.ts
```

Possible content:

```ts
declare module '*.png' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.jpeg' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.webp' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.svg' {
  const value: React.FC<React.SVGProps<SVGSVGElement>>;
  export default value;
}
```

Note:

Only add SVG declaration if the project supports SVG imports.  
If SVG is not configured, do not add SVG support without approval.

---

# 8. Path Aliases

We want these aliases:

```txt
@assets/
@features/
```

Required usage:

```ts
import logo from '@assets/images/logo.png';
import { useLogin } from '@features/auth/hooks/useLogin';
```

The agent should check the current alias configuration first.

Possible files to check:

```txt
tsconfig.json
babel.config.js
metro.config.js
```

Add aliases in the same style used by the project.

---

## Expected tsconfig Paths

If the project uses TypeScript path aliases, add or confirm:

```json
{
  "compilerOptions": {
    "paths": {
      "@assets/*": ["assets/*"],
      "@features/*": ["features/*"]
    }
  }
}
```

If the frontend folder is inside a nested directory, adjust paths accordingly.

Example:

```json
{
  "compilerOptions": {
    "paths": {
      "@assets/*": ["./assets/*"],
      "@features/*": ["./features/*"]
    }
  }
}
```

Follow the existing project setup.

---

## Babel / Metro Note

TypeScript paths alone may not be enough at runtime.

If the project uses Babel module resolver, update it consistently.

Example only:

```js
plugins: [
  [
    'module-resolver',
    {
      alias: {
        '@assets': './assets',
        '@features': './features'
      }
    }
  ]
]
```

Do not add `module-resolver` if the project is not already using it unless necessary and approved.

---

# 9. Color Palette

Use the brand palette:

```css
--brand-primary: #82d7b1;
--brand-primary-hover: #9ef4cc;
--brand-primary-soft: rgba(130, 215, 177, 0.16);
--brand-primary-softest: rgba(94, 220, 175, 0.18);
--brand-secondary: #0e3b31;
--brand-secondary-soft: #1b5d4a;
```

Splash screen:

```txt
background: #82d7b1
```

Login screen:

```txt
background: white or very light neutral
primary button: #82d7b1
headings: #0e3b31
```

---

# 10. Expected Agent Output Before Coding

Before implementation, the agent should return:

```txt
1. Existing frontend structure summary
2. Existing auth-related files if any
3. Existing navigation/routing setup
4. Existing API client path
5. Existing React Query setup
6. Existing shared UI components to reuse
7. Existing theme/color setup
8. Where SplashScreen and LoginScreen should be placed
9. Whether images.d.ts already exists
10. Whether aliases already exist
11. Exact files the agent plans to create/update
```

After this review, implementation can start.

---

# 11. Implementation Scope

For this step, only implement:

```txt
Splash Screen
Login Screen
images.d.ts if needed
@assets alias
@features alias
auth hooks/services structure if needed
```

Do not implement Patient Dashboard yet.

The dashboard starts after this entry flow is complete.

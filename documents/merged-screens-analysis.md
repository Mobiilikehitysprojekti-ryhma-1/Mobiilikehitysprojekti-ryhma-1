# Analysis: Merged "A" (Added) Files vs Existing Screens

This document compares the **new files merged from origin/ui-navigation** (added with "A") with the **existing feature screens** that the app actually uses after the merge.

---

## Summary

| Merged file (A) | Existing counterpart | Relationship |
|-----------------|----------------------|--------------|
| `src/features/screens/AdminHomeScreen.tsx` | `src/features/admin/screens/AdminHomeScreen.tsx` | **New UI placeholder** vs **full implementation** |
| `src/features/screens/LoginScreen.tsx` | `src/features/auth/screens/LoginScreen.tsx` | **New UI (callback-based)** vs **real Firebase auth** |
| `src/features/screens/UserHomeScreen.tsx` | `src/features/user/screens/HomeScreen.tsx` | **New UI placeholder** vs **real app (logout, mode switch)** |
| `src/features/screens/Registration.tsx` | `src/features/auth/screens/RegisterScreen.tsx` | **New UI (more fields)** vs **real `register()`** |
| `src/features/screens/AdminLoginScreen.tsx` | — | **Only in merged set** (admin-specific login UI) |
| `src/features/screens/BiometricLoginScreen.tsx` | — | **Only in merged set** (biometric placeholder) |
| `src/features/screens/ResetPasswordScreen.tsx` | — | **Only in merged set** (reset password UI) |
| `src/app/navigation/LoginStack.tsx` | `src/app/navigation/auth/AuthNavigator.tsx` | **Alternative auth flow** (not used by current RootNavigator) |

**Currently used by the app:** `AuthNavigator` → auth/screens (Login, Register). **Not used:** `LoginStack` and all `features/screens/*` (they are dead code after the merge).

---

## 1. Admin home

| | **Merged (A)** `features/screens/AdminHomeScreen.tsx` | **Existing** `admin/screens/AdminHomeScreen.tsx` |
|---|------------------------------------------------------|--------------------------------------------------|
| **Purpose** | Placeholder “Show stuff here” | Full admin: daily status, meals, meds, location, Firebase tests |
| **UI** | Theme, PrimaryButton, FlatInputField (unused), `primaryContainer` background | Paper Button/Text, DailyStatusDisplay, connection check |
| **Auth/data** | None | `useAuth`, `useAdminHome`, `useMeals`, `useMeds`, `useLocation`, `useDailyStatus` |
| **Used by** | Nothing (LoginStack not in use) | **AdminStack** ✓ |

**Verdict:** Merged version is a **new-UI placeholder**. The **real** admin home is `admin/screens/AdminHomeScreen.tsx`.

---

## 2. Login

| | **Merged (A)** `features/screens/LoginScreen.tsx` | **Existing** `auth/screens/LoginScreen.tsx` |
|---|---------------------------------------------------|---------------------------------------------|
| **Purpose** | User login UI + “Login as admin” → AdminLogin | Real sign-in with Firebase |
| **UI** | Theme, FlatInputField, PrimaryButton, `primaryContainer` | Paper TextInput, Button |
| **Auth** | Callback `onUserLogin()`, hardcoded User/Password | `login({ email, password })` from `authActions` |
| **Used by** | LoginStack (unused) | **AuthNavigator** ✓ |

**Verdict:** Merged version is a **new-UI mock** (callback-based, no Firebase). The **real** login is `auth/screens/LoginScreen.tsx`.

---

## 3. User home

| | **Merged (A)** `features/screens/UserHomeScreen.tsx` | **Existing** `user/screens/HomeScreen.tsx` |
|---|-----------------------------------------------------|--------------------------------------------|
| **Purpose** | Placeholder “Show stuff here” + Check in/out + Camera | Real user home: logout, switch to admin, reset mode |
| **UI** | Theme, PrimaryButton, Icons, `primaryContainer` | Appbar, Paper Button/Text |
| **Auth** | Local `AtHome` state, no real auth | `useAuth`, `logout()`, `useAppMode` |
| **Used by** | Nothing | **UserStack** (as Home screen) ✓ |

**Verdict:** Merged version is a **new-UI placeholder**. The **real** user home is `user/screens/HomeScreen.tsx`.

---

## 4. Registration

| | **Merged (A)** `features/screens/Registration.tsx` | **Existing** `auth/screens/RegisterScreen.tsx` |
|---|---------------------------------------------------|-----------------------------------------------|
| **Purpose** | Create account (email, username, password) | Real Firebase registration |
| **UI** | InputField, PrimaryButton, SecondaryButton, Theme | Paper TextInput, Button |
| **Auth** | No `register()` call (placeholder) | `register({ email, password })` from `authActions` |
| **Used by** | LoginStack (unused) | **AuthNavigator** ✓ |

**Verdict:** Merged version is **new UI with extra field (username)** but no real `register()`. The **real** registration is `auth/screens/RegisterScreen.tsx`.

---

## 5. Screens only in the merged set

- **AdminLoginScreen** – Admin login UI (username/password, `onAdminLogin`). No counterpart in auth; auth has one LoginScreen (email/password).
- **BiometricLoginScreen** – Placeholder for biometric auth. Not used in current navigation.
- **ResetPasswordScreen** – Reset password UI. Not present in auth flow today.

These are **new UI concepts** from ui-navigation; the current app does not use them.

---

## 6. Navigation: LoginStack vs AuthNavigator

| | **LoginStack** (merged) | **AuthNavigator** (current) |
|---|-------------------------|-----------------------------|
| **Screens** | Login, AdminLogin, Registration, ResetPassword (from `features/screens/`) | Login, Register (from `auth/screens/`) |
| **Used by** | **Nobody** – RootNavigator uses AuthNavigator | **RootNavigator** ✓ |
| **Types** | `shared/types/Navigation.ts` (LoginStackParamList, etc.) | `AuthNavigator` own `AuthStackParamList` |

So **LoginStack and all screens it references are currently dead code.**

---

## 7. Shared merged assets (used vs unused)

| Asset | Used by app? | Notes |
|-------|----------------|-------|
| **Theme** (`shared/theme/colors.ts`) | ✓ Yes | AppShell uses `Theme` for PaperProvider. |
| **PrimaryButton, SecondaryButton, FlatInputField, InputField** | Only by `features/screens/*` | Not used by auth/admin/user feature screens → effectively dead unless you switch to new UI. |
| **shared/types/Navigation.ts** | Only by LoginStack + features/screens | AdminStack/UserStack use `admin/navigation/types.ts` and `user/navigation/types.ts` (different param lists). |

---

## 8. Type overlap

- **shared/types/Navigation.ts** (merged): `LoginStackParamList`, `UserStackParamList` (e.g. `UserHome`), `AdminStackParamList` (AdminHome, MealSchedule, MedSchedule, LocationSettings).
- **admin/navigation/types.ts**: `AdminStackParamList` – same screen set, used by AdminStack.
- **user/navigation/types.ts**: `UserStackParamList` – `Home`, `Measurements`, `Safety`, `Tasks` (not `UserHome`).

So **UserStackParamList** is duplicated and **inconsistent**: shared has `UserHome`, user feature has `Home` (and other tabs). The app uses the feature-specific types.

---

## Recommendations

1. **Treat merged `features/screens/*` as “new UI” alternatives**  
   They are newer-looking (Theme, PrimaryButton, FlatInputField) but placeholders or mocks. The **real** behavior lives in `auth/screens`, `admin/screens`, and `user/screens`.

2. **Either adopt the new UI or remove dead code**  
   - **Option A – Adopt new UI:** Gradually replace auth/admin/user screens with the merged versions and connect them to real auth/state (Firebase, stores). Wire LoginStack into the app if you want that flow (e.g. separate Admin login, Reset password, Biometric).  
   - **Option B – Keep current behavior:** Remove or ignore `LoginStack` and `features/screens/*` (and optionally shared buttons/fields if nothing else uses them). Keep using Theme from `shared/theme/colors.ts` only.

3. **Single source of truth for types**  
   Prefer **feature-level** param lists (`admin/navigation/types.ts`, `user/navigation/types.ts`) and auth’s list in AuthNavigator. Either delete `shared/types/Navigation.ts` or re-export from it from feature types to avoid duplication and mismatches (e.g. `UserHome` vs `Home`).

4. **Reuse shared components in real screens**  
   If you like PrimaryButton / FlatInputField / Theme, use them in `auth/screens`, `admin/screens`, and `user/screens` instead of keeping two parallel UIs.

---

## Quick reference: what the app uses today

- **RootNavigator** → AuthNavigator (auth/screens: Login, Register) + ModeNavigator.
- **AdminStack** → admin/screens: AdminHomeScreen, MealScheduleScreen, MedScheduleScreen, LocationSettingsScreen.
- **UserStack** → user/screens: HomeScreen, MeasurementsScreen, SafetyScreen, TasksScreen.
- **Theme** → AppShell (PaperProvider).
- **Not used:** LoginStack, all of `features/screens/*`, shared PrimaryButton/SecondaryButton/FlatInputField/InputField except as used by those unused screens.

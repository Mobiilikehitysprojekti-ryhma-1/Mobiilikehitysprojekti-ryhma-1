# Daily Status Display Plan for AdminHomeScreen

## Overview
Simple display showing current and previous days' status for:
- **Food/Meals**: breakfast, lunch, dinner, supper (4 items)
- **Medications**: morning, noon, evening, night (4 items)  
- **Location**: stayed in safe area (yes/no)

## Data Structure Needed

### Daily Status Log (Firestore)
```
users/{uid}/dailyStatus/{date}  // date format: "2026-01-24"
{
  date: "2026-01-24",
  meals: {
    breakfast: "ok" | "not ok" | "pending",
    lunch: "ok" | "not ok" | "pending",
    dinner: "ok" | "not ok" | "pending",
    supper: "ok" | "not ok" | "pending"
  },
  meds: {
    morning: "ok" | "not ok" | "pending",
    noon: "ok" | "not ok" | "pending",
    evening: "ok" | "not ok" | "pending",
    night: "ok" | "not ok" | "pending"
  },
  location: {
    stayedInArea: true | false,
    breaches: number  // count of boundary breaches
  },
  updatedAt: timestamp
}
```

## UI Design (Simple Text-Based)

### Display Format:
```
┌─────────────────────────────────┐
│ Today (2026-01-24)              │
├─────────────────────────────────┤
│ Food:    ✓ ✓ ✓ ✓                │
│ Meds:    ✓ ✓ ✗ ✓                │
│ Location: Stayed in area ✓      │
├─────────────────────────────────┤
│ Yesterday (2026-01-23)           │
├─────────────────────────────────┤
│ Food:    ✓ ✓ ✓ ✗                │
│ Meds:    ✓ ✗ ✓ ✓                │
│ Location: Stayed in area ✓      │
└─────────────────────────────────┘
```

### Alternative Compact Format:
```
Today:     Food: ✓✓✓✓  Meds: ✓✓✗✓  Area: ✓
Yesterday: Food: ✓✓✓✗  Meds: ✓✗✓✓  Area: ✓
```

## Implementation Plan

### Step 1: Create Daily Status Repository
- `src/features/admin/data/dailyStatusRepository.ts`
- Functions: `getDailyStatus(uid, date)`, `getDailyStatusRange(uid, startDate, endDate)`

### Step 2: Create Daily Status Store
- `src/features/admin/state/dailyStatusStore.ts`
- Hook: `useDailyStatus(uid, days = 7)` - loads last N days

### Step 3: Create Status Display Component
- `src/features/admin/components/DailyStatusDisplay.tsx`
- Simple component that takes status data and renders it

### Step 4: Integrate into AdminHomeScreen
- Add the component to show current + previous day(s)

## Status Symbols
- ✓ or "ok" = completed/taken
- ✗ or "not ok" = missed/not taken
- ○ or "pending" = not yet due (for future items today)

## Notes
- For now, we can use mock data or simple state to test the UI
- Later, the actual status will be logged by the user app when they take meals/meds
- Location status can be calculated from location tracking events

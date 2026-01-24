# Daily Status Auto-Initialization Plan

## Goal
Automatically create today's daily status document with all items set to "pending" at the beginning of each day.

## Options Analysis

### Option 1: Lazy Initialization in Store (RECOMMENDED)
**When:** When `useDailyStatus` hook loads and today's status doesn't exist
**Pros:**
- Simple, no external dependencies
- Works immediately when app opens
- No Cloud Functions needed
- Follows existing architecture pattern
- Only creates when needed (efficient)

**Cons:**
- Requires app to be opened at least once per day
- If user doesn't open app, status won't be created

**Implementation:**
- Modify `useDailyStatus` hook to check if today's status exists
- If not, automatically create it with all items as "pending"
- This happens transparently when the hook loads

---

### Option 2: On App Start / Auth Success
**When:** When user successfully authenticates (in `useAuth` or `AppShell`)
**Pros:**
- Ensures status exists as soon as user logs in
- Centralized initialization point

**Cons:**
- Requires app to be opened
- Might create status even if not needed
- Couples initialization to auth flow

**Implementation:**
- Add initialization function in `AppShell` or after auth success
- Check and create today's status when user is authenticated

---

### Option 3: Cloud Functions Scheduled Job
**When:** Every day at midnight (or specific time)
**Pros:**
- Works even if app isn't opened
- Automatic, no user interaction needed
- Can initialize for all users at once

**Cons:**
- Requires Firebase Cloud Functions setup
- More complex infrastructure
- Costs money (though minimal)
- Need to handle timezone issues

**Implementation:**
- Create scheduled Cloud Function (cron job)
- Runs daily at midnight
- Creates status for all active users

---

### Option 4: Hybrid Approach
**When:** Both lazy initialization + optional Cloud Function
**Pros:**
- Best of both worlds
- Cloud Function ensures it happens even if app not opened
- Lazy init handles immediate needs

**Cons:**
- Most complex
- Requires Cloud Functions

---

## Recommended Solution: Option 1 (Lazy Initialization)

### Implementation Plan

#### Step 1: Add Helper Function to Repository
```typescript
// In dailyStatusRepository.ts
async initializeTodayStatus(uid: string): Promise<DailyStatusDoc | null> {
  const today = new Date().toISOString().split("T")[0];
  const existing = await this.getDailyStatus(uid, today);
  
  if (existing) {
    return existing; // Already exists, return it
  }
  
  // Create new status with all items as "pending"
  const newStatus: DailyStatusPayload = {
    date: today,
    meals: {
      breakfast: "pending",
      lunch: "pending",
      dinner: "pending",
      supper: "pending",
    },
    meds: {
      morning: "pending",
      noon: "pending",
      evening: "pending",
      night: "pending",
    },
    location: {
      stayedInArea: true, // Default to true, will be updated by location tracking
      breaches: 0,
    },
  };
  
  await this.setDailyStatus(uid, newStatus);
  return await this.getDailyStatus(uid, today);
}
```

#### Step 2: Modify Store Hook
```typescript
// In dailyStatusStore.ts
const loadDailyStatus = useCallback(async () => {
  if (!uid) return;
  
  setLoading(true);
  setError(null);
  try {
    // First, ensure today's status exists
    await dailyStatusRepository.initializeTodayStatus(uid);
    
    // Then load recent statuses
    const recentStatuses = await dailyStatusRepository.getRecentDailyStatus(uid, days);
    setStatuses(recentStatuses);
  } catch (err: any) {
    console.error("Error loading daily status:", err);
    setError(err.message || "Failed to load daily status");
  } finally {
    setLoading(false);
  }
}, [uid, days]);
```

#### Step 3: Optional - Add to Repository
Add `initializeTodayStatus` as a public method in the repository.

---

## Alternative: Simpler Approach

If you want even simpler, just modify `loadDailyStatus` to check and create:

```typescript
const loadDailyStatus = useCallback(async () => {
  if (!uid) return;
  
  setLoading(true);
  setError(null);
  try {
    const today = new Date().toISOString().split("T")[0];
    const todayStatus = await dailyStatusRepository.getDailyStatus(uid, today);
    
    // If today's status doesn't exist, create it
    if (!todayStatus) {
      await dailyStatusRepository.setDailyStatus(uid, {
        date: today,
        meals: { breakfast: "pending", lunch: "pending", dinner: "pending", supper: "pending" },
        meds: { morning: "pending", noon: "pending", evening: "pending", night: "pending" },
        location: { stayedInArea: true, breaches: 0 },
      });
    }
    
    // Load recent statuses
    const recentStatuses = await dailyStatusRepository.getRecentDailyStatus(uid, days);
    setStatuses(recentStatuses);
  } catch (err: any) {
    console.error("Error loading daily status:", err);
    setError(err.message || "Failed to load daily status");
  } finally {
    setLoading(false);
  }
}, [uid, days]);
```

---

## Decision Points

1. **When should initialization happen?**
   - ✅ Recommended: When loading daily status (lazy)
   - Alternative: On app start

2. **What should be the default values?**
   - All meals/meds: `"pending"` (recommended)
   - Location: `stayedInArea: true`, `breaches: 0`

3. **Should we initialize past days?**
   - ❌ No - only initialize today
   - Past days should remain as they were

4. **What if user opens app multiple times per day?**
   - Check if today's status exists first
   - Only create if it doesn't exist (idempotent)

---

## Next Steps

1. Choose approach (recommend Option 1 - lazy initialization)
2. Implement helper function or inline check
3. Test that it works when:
   - App opens on new day
   - App opens multiple times same day
   - App hasn't been opened for days

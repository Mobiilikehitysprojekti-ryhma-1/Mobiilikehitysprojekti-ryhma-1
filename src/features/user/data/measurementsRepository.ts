import { serverTimestamp } from "firebase/firestore";
import { dailyStatusRepository, type BPReading, type BPStatus, type DailyStatusDoc } from "../../admin/data/dailyStatusRepository";

// Re-export types for convenience
export type { BPReading, BPStatus };

export type BloodPressureDailyDoc = {
  date: string;
  morning?: {
    reading: BPReading;
    status: BPStatus;
  };
  evening?: {
    reading: BPReading;
    status: BPStatus;
  };
};

function readingToStatus(reading: BPReading): BPStatus {
  // If we have valid readings, status is "ok", otherwise "pending"
  if (reading.sys !== null && reading.dia !== null) {
    return "ok";
  }
  return "pending";
}

export const bloodPressureRepository = {
  async getDaily(uid: string, date: string): Promise<BloodPressureDailyDoc | null> {
    const dailyStatus = await dailyStatusRepository.getDailyStatus(uid, date);
    if (!dailyStatus || !dailyStatus.bloodPressure) return null;
    
    return {
      date: dailyStatus.date,
      morning: dailyStatus.bloodPressure.morning,
      evening: dailyStatus.bloodPressure.evening,
    };
  },

  async setMorningReading(uid: string, date: string, reading: BPReading): Promise<void> {
    // Get existing daily status to preserve other fields
    const existing = await dailyStatusRepository.getDailyStatus(uid, date);
    
    // Merge blood pressure data with existing daily status
    const updatedStatus: DailyStatusDoc = {
      date,
      meals: existing?.meals || {
        breakfast: "pending",
        lunch: "pending",
        dinner: "pending",
        supper: "pending",
      },
      meds: existing?.meds || {
        morning: "pending",
        noon: "pending",
        evening: "pending",
        night: "pending",
      },
      location: existing?.location || {
        stayedInArea: true,
        breaches: 0,
      },
      bloodPressure: {
        morning: {
          reading,
          status: readingToStatus(reading),
        },
        evening: existing?.bloodPressure?.evening || {
          reading: { sys: null, dia: null, pulse: null },
          status: "pending" as BPStatus,
        },
      },
    };
    
    await dailyStatusRepository.setDailyStatus(uid, updatedStatus);
  },

  async setEveningReading(uid: string, date: string, reading: BPReading): Promise<void> {
    // Get existing daily status to preserve other fields
    const existing = await dailyStatusRepository.getDailyStatus(uid, date);
    
    // Merge blood pressure data with existing daily status
    const updatedStatus: DailyStatusDoc = {
      date,
      meals: existing?.meals || {
        breakfast: "pending",
        lunch: "pending",
        dinner: "pending",
        supper: "pending",
      },
      meds: existing?.meds || {
        morning: "pending",
        noon: "pending",
        evening: "pending",
        night: "pending",
      },
      location: existing?.location || {
        stayedInArea: true,
        breaches: 0,
      },
      bloodPressure: {
        morning: existing?.bloodPressure?.morning || {
          reading: { sys: null, dia: null, pulse: null },
          status: "pending" as BPStatus,
        },
        evening: {
          reading,
          status: readingToStatus(reading),
        },
      },
    };
    
    await dailyStatusRepository.setDailyStatus(uid, updatedStatus);
  },

  async getRange(uid: string, startDate: string, endDate: string): Promise<BloodPressureDailyDoc[]> {
    const dailyStatuses = await dailyStatusRepository.getDailyStatusRange(uid, startDate, endDate);
    
    return dailyStatuses
      .filter((ds) => ds.bloodPressure) // Only return entries with blood pressure data
      .map((ds) => ({
        date: ds.date,
        morning: ds.bloodPressure!.morning,
        evening: ds.bloodPressure!.evening,
      }));
  },
};
  
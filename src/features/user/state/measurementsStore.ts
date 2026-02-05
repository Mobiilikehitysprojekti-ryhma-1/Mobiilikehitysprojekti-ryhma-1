import { useState, useCallback } from "react";
import { bloodPressureRepository, type BPReading, type BloodPressureDailyDoc } from "../data/measurementsRepository";
import { takePhotoAndReadBP, type BloodPressureResult } from "../services/bloodPressureService";

export function useMeasurements(uid: string | undefined) {
  const [dailyData, setDailyData] = useState<BloodPressureDailyDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{
    slot: "morning" | "evening";
    result: BloodPressureResult;
  } | null>(null);

  const loadDaily = useCallback(async (date: string) => {
    if (!uid) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await bloodPressureRepository.getDaily(uid, date);
      setDailyData(data);
    } catch (err: any) {
      console.error("[measurementsStore] Error loading daily measurements:", err?.message || String(err));
      setError(err.message || "Failed to load measurements");
    } finally {
      setLoading(false);
    }
  }, [uid]);

  const saveReading = useCallback(async (
    date: string,
    slot: "morning" | "evening",
    reading: BPReading
  ) => {
    if (!uid) return;
    
    setLoading(true);
    setError(null);
    try {
      if (slot === "morning") {
        await bloodPressureRepository.setMorningReading(uid, date, reading);
      } else {
        await bloodPressureRepository.setEveningReading(uid, date, reading);
      }
      
      // Reload daily data to get updated status
      await loadDaily(date);
    } catch (err: any) {
      console.error("[measurementsStore] Error saving reading:", err?.message || String(err));
      setError(err.message || "Failed to save reading");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [uid, loadDaily]);

  const takeAndReadBP = useCallback(async (): Promise<BloodPressureResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await takePhotoAndReadBP();
      return result;
    } catch (err: any) {
      console.error("[measurementsStore] Error taking photo:", err?.message || String(err));
      setError(err.message || "Failed to take photo");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const setLastReadingResult = useCallback((slot: "morning" | "evening", result: BloodPressureResult) => {
    setLastResult({ slot, result });
  }, []);

  return {
    dailyData,
    loading,
    error,
    lastResult,
    loadDaily,
    saveReading,
    takeAndReadBP,
    setLastReadingResult,
  };
}

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

export type AppMode = "user" | "admin";

const STORAGE_KEY = "app_mode";

type AppModeContextValue = {
    mode: AppMode;
    setMode: (mode: AppMode) => Promise<void>;
    ready: boolean;
    /** True when mode was loaded from storage this session (skip picker). */
    restoredFromStorage: boolean;
    /** Clear stored mode and show User/Admin picker again (resets to "beginning"). */
    resetToModePicker: () => Promise<void>;
    /** Increments when resetToModePicker is called (use as key to remount navigator). */
    resetKey: number;
};

const AppModeContext = createContext<AppModeContextValue | null>(null);

export function AppModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<AppMode>("user");
    const [ready, setReady] = useState(false);
    const [restoredFromStorage, setRestoredFromStorage] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        SecureStore.getItemAsync(STORAGE_KEY).then((stored) => {
            if (stored === "admin" || stored === "user") {
                setModeState(stored);
                setRestoredFromStorage(true);
            }
            setReady(true);
        });
    }, []);

    const setMode = useCallback(async (newMode: AppMode) => {
        setModeState(newMode);
        await SecureStore.setItemAsync(STORAGE_KEY, newMode);
    }, []);

    const resetToModePicker = useCallback(async () => {
        await SecureStore.deleteItemAsync(STORAGE_KEY);
        setRestoredFromStorage(false);
        setResetKey((k) => k + 1);
    }, []);

    const value: AppModeContextValue = { mode, setMode, ready, restoredFromStorage, resetToModePicker, resetKey };

    return (
        <AppModeContext.Provider value={value}>
            {children}
        </AppModeContext.Provider>
    );
}

export function useAppMode(): AppModeContextValue {
    const ctx = useContext(AppModeContext);
    if (!ctx) throw new Error("useAppMode must be used within AppModeProvider");
    return ctx;
}

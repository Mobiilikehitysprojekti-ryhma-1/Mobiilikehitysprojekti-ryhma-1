import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

export type AppMode = "user" | "admin";

const STORAGE_KEY = "app_mode";

type AppModeContextValue = {
    mode: AppMode;
    setMode: (mode: AppMode) => Promise<void>;
    ready: boolean;
};

const AppModeContext = createContext<AppModeContextValue | null>(null);

export function AppModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<AppMode>("user");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        SecureStore.getItemAsync(STORAGE_KEY).then((stored) => {
            if (stored === "admin" || stored === "user") {
                setModeState(stored);
            }
            setReady(true);
        });
    }, []);

    const setMode = useCallback(async (newMode: AppMode) => {
        setModeState(newMode);
        await SecureStore.setItemAsync(STORAGE_KEY, newMode);
    }, []);

    const value: AppModeContextValue = { mode, setMode, ready };

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

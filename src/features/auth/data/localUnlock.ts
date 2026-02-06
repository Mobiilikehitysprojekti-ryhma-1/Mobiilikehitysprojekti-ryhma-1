import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const KEY = "local_unlock_ok";

export async function ensureUnlockedOnLaunch(): Promise<boolean> {
    const stored = await SecureStore.getItemAsync(KEY);
    if (stored === "1") return true;

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
        // fallback: allow without biometrics if device has none
        await SecureStore.setItemAsync(KEY, "1");
        return true;
    }

    const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Vahvista henkilöllisyys",
        fallbackLabel: "Käytä laitteen PIN-koodia",
    });

    if (result.success) {
        await SecureStore.setItemAsync(KEY, "1");
        return true;
    }

    return false;
}

export async function clearLocalUnlock() {
    await SecureStore.deleteItemAsync(KEY);
}

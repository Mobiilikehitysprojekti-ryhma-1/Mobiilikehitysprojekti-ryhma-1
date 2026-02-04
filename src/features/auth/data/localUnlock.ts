import * as LocalAuthentication from "expo-local-authentication";

export async function ensureUnlockedOnLaunch(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) return true;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Open app",
    fallbackLabel: "Use PIN code",
    cancelLabel: "Cancel",
    disableDeviceFallback: false
  });

  return Boolean(result.success);
}

export async function clearLocalUnlock() {
}

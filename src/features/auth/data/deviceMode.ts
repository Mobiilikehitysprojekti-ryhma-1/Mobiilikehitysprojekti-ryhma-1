import AsyncStorage from "@react-native-async-storage/async-storage";

export type DeviceMode = "caregiver" | "careRecipient";

const KEY = "deviceMode";

export async function getDeviceMode(): Promise<DeviceMode | null> {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw === "caregiver" || raw === "careRecipient") return raw;
    return null;
}

export async function setDeviceMode(mode: DeviceMode): Promise<void> {
    await AsyncStorage.setItem(KEY, mode);
}

export async function clearDeviceMode(): Promise<void> {
    await AsyncStorage.removeItem(KEY);
}

import { MD3DarkTheme, MD3LightTheme, useTheme as usePaperTheme } from "react-native-paper";

const customProperties = {
  spacing: {
    extraSmall: 4,
    small: 8,
    medium: 16,
    large: 24,
    extraLarge: 32,
  },
  width: {
    small: "25%",
    half: "50%",
    large: "80%",
    full: "100%",
  },
  height: {
    small: "25%",
    half: "50%",
    large: "80%",
    full: "100%",
  },
} as const;

const baseLightTheme = {
  ...MD3LightTheme,
  ...customProperties,
  fonts: {
    ...MD3LightTheme.fonts,
    titleLarge: { ...MD3LightTheme.fonts.titleLarge, fontSize: 24, fontWeight: "600" as const },
    titleMedium: { ...MD3LightTheme.fonts.titleLarge, fontSize: 20, fontWeight: "400" as const },
    titleSmall: { ...MD3LightTheme.fonts.titleLarge, fontSize: 18, fontWeight: "200" as const },
    bodySmall: { ...MD3LightTheme.fonts.bodyLarge, fontSize: 8, lineHeight: 12 },
    bodyLarge: { ...MD3LightTheme.fonts.bodyLarge, fontSize: 16, lineHeight: 24 },
    bodyMedium: { ...MD3LightTheme.fonts.bodyMedium, fontSize: 14, lineHeight: 20 },
  },
  colors: {
    ...MD3LightTheme.colors,

    primary: "#4682B4",
    onPrimary: "#FFFFFF",
    secondary: "#2B608B",
    onSecondary: "#FFFFFF",
    tertiary: "#4B9CD3",
    onTertiary: "#C0C0C0",
    background: "#F8FAFC",
    surface: "#F8FAFC",
    onSurface: "#0F172A",
    onSurfaceVariant: "#64748B",
    primaryContainer: "#4682B4",
    onPrimaryContainer: "#0A2540",
    error: "#EF4444",
    outline: "#CBD5E1",
    backdrop: "#F3F4F6",
  },
};

export type AppTheme = typeof baseLightTheme;
export const AppLightTheme: AppTheme = baseLightTheme;

export const AppDarkTheme: AppTheme = {
  ...MD3DarkTheme,
  ...customProperties,
  fonts: baseLightTheme.fonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#325D79",
    onPrimary: "#FFFFFF",
    secondary: "#1B3B52",
    onSecondary: "#BDC7D0",
    tertiary: "#24455A",
    onTertiary: "#FFFFFF",
    background: "#0B1218",
    surface: "#16212B",
    onSurface: "#BDC7D0",
    onSurfaceVariant: "#7E8C9A",
    primaryContainer: "#24455A",
    onPrimaryContainer: "#CEE5FF",

    error: "#CF6679",
    outline: "#2D3E4E",
    backdrop: "rgba(0, 0, 0, 0.7)",
  },
};

export const useAppTheme = () => {
  const contextTheme = usePaperTheme<AppTheme>();

  if (!contextTheme || !contextTheme.spacing) {
    return AppLightTheme;
  }

  return contextTheme;
};
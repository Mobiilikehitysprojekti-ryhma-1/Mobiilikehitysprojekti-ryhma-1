import { MD3LightTheme, useTheme as usePaperTheme } from "react-native-paper";

export const Theme = {
  ...MD3LightTheme,

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

  fonts: {
    ...MD3LightTheme.fonts,

    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontSize: 24,
      fontWeight: "600" as const,
    },

    titleMedium: {
      ...MD3LightTheme.fonts.titleLarge,
      fontSize: 20,
      fontWeight: "400" as const,
    },

    titleSmall: {
      ...MD3LightTheme.fonts.titleLarge,
      fontSize: 18,
      fontWeight: "200" as const,
    },
    
    bodySmall: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontSize: 8,
      lineHeight: 12,
    },
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontSize: 16,
      lineHeight: 24,
    },

    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontSize: 14,
      lineHeight: 20,
    },
  },

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

export const useAppTheme = () => usePaperTheme<typeof Theme>();
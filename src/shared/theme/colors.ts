import { MD3LightTheme } from 'react-native-paper';

export const Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    // Brand / actions
    primary: '#4682B4',
    onPrimary: '#FFFFFF',

    secondary: '#2B608B',
    onSecondary: '#FFFFFF',
    tertiary: '#4B9CD3',
    onTertiary: '#c0c0c0',
    // Layout
    background: '#F8FAFC',
    surface: '#F8FAFC',
    primaryContainer: '#4682B4',
    onPrimaryContainer: '#0A2540',


    // Utility
    error: '#EF4444',
    outline: '#CBD5E1',
    disabled: '#9CA3AF',
    placeholder: '#6B7280',
    backdrop: '#F3F4F6',
  },
};

// These are mainly random placeholder colors for now.
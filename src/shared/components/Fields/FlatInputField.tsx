import { TextInput, TextInputProps, useTheme } from 'react-native-paper';

export function FlatInputField(props: TextInputProps) {
  const theme = useTheme();
  
  return (
    <TextInput
      mode="flat"
      style={[
        { 
          height: 62, 
          backgroundColor: theme.colors.surface,
        }, 
        props.style
      ]}
      theme={{
        colors: {
          background: 'transparent', 
          primary: theme.colors.primary,
          text: theme.colors.onSurface, // Text color from theme
          placeholder: theme.colors.onSurfaceVariant,
          onSurface: theme.colors.onSurface, // Label color
          onSurfaceVariant: theme.colors.onSurfaceVariant,
        },
        roundness: 0
      }}
      underlineColor={theme.colors.outline}
      activeUnderlineColor={theme.colors.primary}
      selectionColor={theme.colors.primary}
      {...props}
    />
  );
}
import { TextInput, TextInputProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/theme';

export function FlatInputField(props: TextInputProps) {
  const theme = useAppTheme();
  const { colors } = theme;

  return (
    <TextInput
      mode="flat"
      style={[
        {
          height: 62,
          backgroundColor: colors.surface,
        },
        props.style
      ]}
      theme={{
        colors: {
          background: 'transparent',
          primary: colors.primary,
          text: colors.onSurface,
          placeholder: colors.onSurfaceVariant,
          onSurface: colors.onSurface,
          onSurfaceVariant: colors.onSurfaceVariant,
        },
        roundness: 0
      }}
      underlineColor={colors.outline}
      activeUnderlineColor={colors.primary}
      selectionColor={colors.primary}
      {...props}
    />
  );
}
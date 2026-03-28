import { TextInput, TextInputProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/theme';

export function InputField(props: TextInputProps) {
  const theme = useAppTheme();
  const { colors } = theme;

  return (
    <TextInput
      mode="outlined"
      style={[
        {
          borderRadius: 0,
          height: 62,
          marginBottom: 12,
          backgroundColor: 'transparent'
        },
        props.style
      ]}
      theme={{
        colors: {
          background: 'transparent',
          surface: 'transparent',
        },
        roundness: 0
      }}
      outlineColor={colors.outline}
      activeOutlineColor={colors.primary}
      {...props}
    />
  );
}
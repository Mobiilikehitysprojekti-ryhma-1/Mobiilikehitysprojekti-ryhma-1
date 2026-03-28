import { Button, ButtonProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/theme';

export function PrimaryButton({
  textColor,
  buttonColor,
  style,
  children,
  mode = "contained",
  ...rest
}: ButtonProps) {
  const theme = useAppTheme();
  const { colors } = theme;

  return (
    <Button
      {...rest}

      mode={mode}
      buttonColor={buttonColor ?? colors.primary}
      textColor={textColor ?? colors.onPrimary}

      style={[
        {
          borderRadius: 3,
          borderColor: colors.outline,
          padding: 8,
        },
        style,
      ]}
    >
      {children}
    </Button>
  );
}

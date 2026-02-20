import { Button, ButtonProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/theme';

export function SecondaryButton({
  textColor,
  buttonColor,
  style,
  children,
  mode = "outlined",
  ...rest
}: ButtonProps) {
  const theme = useAppTheme();
  const { colors } = theme;

  return (
    <Button
      mode={mode}
      buttonColor={buttonColor ?? colors.primary}
      textColor={textColor ?? colors.onPrimary}
      style={[
        {
          borderRadius: 0,
          padding: 8
        },
        style
      ]}
      {...rest}
    >
      {children}
    </Button>
  );
}

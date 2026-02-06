import { Button, ButtonProps, useTheme } from 'react-native-paper';

export function PrimaryButton({
  textColor,
  buttonColor,
  style,
  children,
  mode = "contained",
  ...rest
}: ButtonProps) {
  const theme = useTheme();

  return (
    <Button
      {...rest}

      mode={mode}
      buttonColor={buttonColor ?? theme.colors.primary}
      textColor={textColor ?? theme.colors.onPrimary}

      style={[
        {
          borderRadius: 3,
          borderColor: theme.colors.outline,
          padding: 8,
        },
        style,
      ]}
    >
      {children}
    </Button>
  );
}

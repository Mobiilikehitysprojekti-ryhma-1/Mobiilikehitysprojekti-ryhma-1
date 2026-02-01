import { Button, ButtonProps, useTheme } from 'react-native-paper';

export function SecondaryButton({
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
      mode={mode}
      buttonColor={buttonColor ?? theme.colors.primary}
      textColor={textColor ?? theme.colors.onPrimary}
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

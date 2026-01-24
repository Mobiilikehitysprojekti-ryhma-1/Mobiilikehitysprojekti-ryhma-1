// PrimaryButton.tsx
import { Button, ButtonProps, useTheme } from 'react-native-paper';

export function PrimaryButton(props: ButtonProps) {
  const theme = useTheme();
  
  return (
    <Button
      mode="contained"
      {...props}
      style={[
        { 
          borderRadius: 0,
          padding: 8
        },
        props.style
      ]}
      textColor={theme.colors.onPrimary}
      buttonColor={theme.colors.primary}
    >
      {props.children}
    </Button>
  );
}
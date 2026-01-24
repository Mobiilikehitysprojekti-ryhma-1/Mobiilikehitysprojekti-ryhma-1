import { Button, ButtonProps } from 'react-native-paper';

export function PrimaryButton(props: ButtonProps) {
  return (
    <Button
      mode="contained"
      style={[{ borderRadius: 0, padding: 8 }, props.style]}
      {...props}
    />
  );
}

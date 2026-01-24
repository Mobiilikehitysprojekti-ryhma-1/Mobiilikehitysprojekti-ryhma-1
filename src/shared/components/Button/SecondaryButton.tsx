import { Button, ButtonProps } from 'react-native-paper';

export function SecondaryButton(props: ButtonProps) {
  return (
    <Button
      mode="outlined"
      style={[{ borderRadius: 0 }, props.style]}
      {...props}
    />
  );
}

import { TextInput, TextInputProps } from 'react-native-paper';

export function InputField(props: TextInputProps) {
  return (
    <TextInput
      mode="outlined"
      style={[{ backgroundColor: 'transparent', borderRadius: 0, height: 62, marginBottom: 12 }, props.style]}
      {...props}
    />
  );
}
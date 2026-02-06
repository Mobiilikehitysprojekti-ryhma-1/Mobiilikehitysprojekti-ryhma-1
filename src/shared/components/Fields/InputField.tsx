import { TextInput, TextInputProps, useTheme } from 'react-native-paper';

export function InputField(props: TextInputProps) {
  const theme = useTheme();
  
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
      outlineColor={theme.colors.outline}
      activeOutlineColor={theme.colors.primary}
      {...props}
    />
  );
}
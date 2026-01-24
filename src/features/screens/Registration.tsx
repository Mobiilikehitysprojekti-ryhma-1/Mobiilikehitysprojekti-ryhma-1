import { View, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared/types/Navigation";

import { PrimaryButton } from "../../shared/components/Button/PrimaryButton";
import { SecondaryButton } from "../../shared/components/Button/SecondaryButton";
import { InputField } from "../../shared/components/Fields/InputField";


type RegistrationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Registration"
>;

export default function RegistrationScreen({ navigation }: RegistrationScreenProps) {
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
      <View style={{ width: "100%", maxWidth: 400 }}>
        <Text style={{ fontSize: 24, marginBottom: 24 }}>
          Login
        </Text>

        <InputField
          label="Email"
          placeholder="hello@domain.com"
        />

        <InputField
          label="Username"
          placeholder="Enter your username"
        />

        <InputField
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
        />

        <View style={{ height: 32 }} />

        <PrimaryButton
          onPress={() =>
            navigation.navigate("Login")
          }
        >
          Register
        </PrimaryButton>
      </View>

      <View style={{ width: "100%", maxWidth: 400, alignItems: 'center', marginBottom: 66 }}>
        <Text style={{ fontSize: 24, marginBottom: 18, textAlign: 'center' }}>
          Already have an account?
        </Text>
        <View style={{ width: "100%" }}>
        <SecondaryButton onPress={() => 
            console.log("Pressed")}>
          Login
        </SecondaryButton>
        </View>
      </View>
    </View>
  );
}

import { View, Text } from "react-native";
import { PrimaryButton } from "../../shared/components/Button/PrimaryButton";
import { SecondaryButton } from "../../shared/components/Button/SecondaryButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared/types/Navigation";

type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>Home Screen</Text>

      <PrimaryButton onPress={() => navigation.navigate("Registration")}>
        Register
      </PrimaryButton>

      <SecondaryButton onPress={() => console.log("Pressed")}>
        Login
      </SecondaryButton>
    </View>
  );
}
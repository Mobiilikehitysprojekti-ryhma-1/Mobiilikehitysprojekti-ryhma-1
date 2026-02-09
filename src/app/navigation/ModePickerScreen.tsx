import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAppMode } from "../../shared/context/appModeContext";
import { BodyText } from '../../shared/components/Texts/BodyText'
import { HeaderText } from "../../shared/components/Texts/HeaderText";
import { PrimaryButton } from "../../shared/components/Button/PrimaryButton";
import { useAppTheme } from "../../shared/theme/theme";
import { useTheme } from "react-native-paper";


type Props = {
  onChosen: () => void;
};

export default function ModePickerScreen({ onChosen }: Props) {
  const { setMode } = useAppMode();
  const { spacing, width, height } = useAppTheme();
  const theme = useTheme();

  const choose = async (mode: "user" | "admin") => {
    try {
      await setMode(mode);
    } finally {
      onChosen();
    }
  };

  return (
    <View style={{ width: width.full, backgroundColor: theme.colors.primaryContainer, height: height.full, justifyContent: "center"}}>
      <HeaderText centered marginBottom="large">
        Choose app default setting:
      </HeaderText>
      <View>
        <PrimaryButton
          buttonColor={theme.colors.secondary}
          style={{ margin: spacing.medium }}
          onPress={() => choose("admin")}> User
        </PrimaryButton>
        <PrimaryButton
          buttonColor={theme.colors.secondary}
          style={{ margin: spacing.medium }}
          onPress={() => choose("admin")}> Admin
        </PrimaryButton>
      </View>
    </View>
  );
}


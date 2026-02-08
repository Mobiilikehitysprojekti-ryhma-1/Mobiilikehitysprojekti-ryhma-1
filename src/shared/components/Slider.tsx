import Slider from '@react-native-community/slider';
import { useAppTheme } from '../../shared/theme/theme'; // Your custom hook

export const CustomSlider = () => {
  const theme = useAppTheme();

  return (
    <Slider
      style={{ width: '100%', height: 40 }}
      minimumValue={0}
      maximumValue={100}
      // Use your theme colors!
      minimumTrackTintColor={theme.colors.onPrimary}
      maximumTrackTintColor={theme.colors.outline}
      thumbTintColor={theme.colors.tertiary}
      onValueChange={(value) => console.log(value)}
    />
  );
};
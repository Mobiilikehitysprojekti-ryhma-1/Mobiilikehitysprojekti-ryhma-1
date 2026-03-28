import React from 'react';
import Slider from '@react-native-community/slider';
import { useAppTheme } from '../../shared/theme/theme';

export const CustomSlider = (props: any) => {
  const theme = useAppTheme();
  const { colors } = theme;

  return (
    <Slider
      style={{ width: '100%', height: 50, transform: [{ scaleY: 1.2 }] }}
      minimumTrackTintColor={colors.onSurface}
      maximumTrackTintColor={colors.outline}
      thumbTintColor={colors.secondary}
      {...props}
    />
  );
};
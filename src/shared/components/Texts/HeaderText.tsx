import React from 'react';
import { Text as PaperText, TextProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/theme';

interface HeaderTextProps extends TextProps<never> {
  margin?: any; 
  marginTop?: any;
  marginBottom?: any;
  marginLeft?: any;
  marginRight?: any;
  marginVertical?: any;
  marginHorizontal?: any;
  centered?: boolean;
}

export const HeaderText = ({ 
  style, 
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  marginVertical,
  marginHorizontal,
  variant = "titleLarge",
  centered = false,
  ...props 
}: HeaderTextProps) => {
  const theme = useAppTheme();
  const { spacing, colors } = theme;

  const getMargin = (value?: any) => {
    if (value === undefined) return undefined;
    return (typeof value === 'string' && spacing) ? spacing[value as keyof typeof spacing] : value;
  };

  return (
    <PaperText
      variant={variant}
      {...props}
      style={[
        { 
          margin: getMargin(margin),
          marginTop: getMargin(marginTop),
          marginBottom: getMargin(marginBottom),
          marginLeft: getMargin(marginLeft),
          marginRight: getMargin(marginRight),
          marginVertical: getMargin(marginVertical),
          marginHorizontal: getMargin(marginHorizontal),
          textAlign: centered ? 'center' : 'left',
          color: colors.onPrimary || colors.onSurface,  
        }, 
        style
      ]}
    />
  );
};
import React from 'react';
import { Text as PaperText, TextProps } from 'react-native-paper';
import { Theme } from '../../theme/theme';

// Shared helper to resolve theme keys or raw numbers
const getMargin = (value?: keyof typeof Theme.spacing | number) => {
  if (value === undefined) return undefined;
  return typeof value === 'string' ? Theme.spacing[value] : value;
};

interface HeaderTextProps extends TextProps<never> {
  margin?: keyof typeof Theme.spacing | number;
  marginTop?: keyof typeof Theme.spacing | number;
  marginBottom?: keyof typeof Theme.spacing | number;
  marginLeft?: keyof typeof Theme.spacing | number;
  marginRight?: keyof typeof Theme.spacing | number;
  marginVertical?: keyof typeof Theme.spacing | number;
  marginHorizontal?: keyof typeof Theme.spacing | number;
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
          color: Theme.colors.onPrimary 
        }, 
        style
      ]}
    />
  );
};
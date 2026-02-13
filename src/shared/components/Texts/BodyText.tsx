import React from 'react';
import { Text as PaperText, TextProps } from 'react-native-paper';
import { Theme } from '../../theme/theme';

// Helper to resolve the margin value from the theme or raw number
const getMargin = (value?: keyof typeof Theme.spacing | number) => {
  if (value === undefined) return undefined;
  return typeof value === 'string' ? Theme.spacing[value] : value;
};

interface BodyTextProps extends TextProps<never> {
  margin?: keyof typeof Theme.spacing | number;
  marginTop?: keyof typeof Theme.spacing | number;
  marginBottom?: keyof typeof Theme.spacing | number;
  marginLeft?: keyof typeof Theme.spacing | number;
  marginRight?: keyof typeof Theme.spacing | number;
  marginVertical?: keyof typeof Theme.spacing | number;
  marginHorizontal?: keyof typeof Theme.spacing | number;
  color?: string;
}

export const BodyText = ({ 
  style, 
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  marginVertical,
  marginHorizontal,
  variant = "bodyLarge",
  color,
  ...props 
}: BodyTextProps) => {

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
          color: color || "#fff", 
        }, 
        style
      ]}
    />
  );
};
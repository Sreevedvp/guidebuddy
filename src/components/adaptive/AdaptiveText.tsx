import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { useResponsive, platformStyles } from '../../utils/platform';
import { COLORS, TYPOGRAPHY } from '../../constants';

interface AdaptiveTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
  weight?: 'normal' | 'medium' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  selectable?: boolean;
}

export const AdaptiveText: React.FC<AdaptiveTextProps> = ({
  children,
  style,
  variant = 'body',
  weight = 'normal',
  color = COLORS.TEXT_PRIMARY,
  align = 'left',
  numberOfLines,
  selectable = false,
}) => {
  const { screenSize } = useResponsive();
  
  const getVariantStyles = (): TextStyle => {
    const baseStyles = {
      h1: {
        fontSize: screenSize === 'desktop' ? TYPOGRAPHY.FONT_SIZE.XXXL : TYPOGRAPHY.FONT_SIZE.XXL,
        lineHeight: screenSize === 'desktop' ? 40 : 32,
        fontWeight: 'bold' as const,
      },
      h2: {
        fontSize: screenSize === 'desktop' ? TYPOGRAPHY.FONT_SIZE.XXL : TYPOGRAPHY.FONT_SIZE.XL,
        lineHeight: screenSize === 'desktop' ? 32 : 28,
        fontWeight: 'bold' as const,
      },
      h3: {
        fontSize: screenSize === 'desktop' ? TYPOGRAPHY.FONT_SIZE.XL : TYPOGRAPHY.FONT_SIZE.LG,
        lineHeight: screenSize === 'desktop' ? 28 : 24,
        fontWeight: 'medium' as const,
      },
      h4: {
        fontSize: TYPOGRAPHY.FONT_SIZE.LG,
        lineHeight: 24,
        fontWeight: 'medium' as const,
      },
      body: {
        fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
        lineHeight: 24,
        fontWeight: 'normal' as const,
      },
      caption: {
        fontSize: TYPOGRAPHY.FONT_SIZE.SM,
        lineHeight: 20,
        fontWeight: 'normal' as const,
        color: COLORS.TEXT_SECONDARY,
      },
      label: {
        fontSize: TYPOGRAPHY.FONT_SIZE.SM,
        lineHeight: 20,
        fontWeight: 'medium' as const,
      },
    };
    
    return baseStyles[variant];
  };
  
  const styles = StyleSheet.create({
    text: {
      fontFamily: TYPOGRAPHY.FONT_FAMILY.REGULAR,
      color,
      textAlign: align,
      ...getVariantStyles(),
      fontWeight: platformStyles.fontWeight(weight) as any,
      ...style,
    },
  });
  
  return (
    <Text
      style={styles.text}
      numberOfLines={numberOfLines}
      selectable={selectable}
      ellipsizeMode="tail"
    >
      {children}
    </Text>
  );
};

export default AdaptiveText;
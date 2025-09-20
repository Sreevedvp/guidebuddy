import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useResponsive, layoutUtils, platformStyles } from '../../utils/platform';
import { COLORS, SPACING } from '../../constants';

interface AdaptiveViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  centered?: boolean;
  maxWidth?: boolean;
  padding?: keyof typeof SPACING | number;
  elevation?: number;
  backgroundColor?: string;
  fullHeight?: boolean;
}

export const AdaptiveView: React.FC<AdaptiveViewProps> = ({
  children,
  style,
  centered = false,
  maxWidth = false,
  padding,
  elevation,
  backgroundColor = COLORS.WHITE,
  fullHeight = false,
}) => {
  const { screenSize, width } = useResponsive();
  
  const getPaddingValue = () => {
    if (typeof padding === 'number') return padding;
    if (typeof padding === 'string') return SPACING[padding];
    return 0;
  };
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor,
      ...(fullHeight && { flex: 1 }),
      ...(centered && {
        alignItems: 'center',
        justifyContent: 'center',
      }),
      ...(maxWidth && {
        maxWidth: layoutUtils.getMaxContentWidth(),
        alignSelf: 'center',
        width: '100%',
      }),
      ...(padding && {
        padding: getPaddingValue(),
      }),
      ...(elevation && platformStyles.elevation(elevation)),
      ...style,
    },
  });
  
  return <View style={styles.container}>{children}</View>;
};

export default AdaptiveView;
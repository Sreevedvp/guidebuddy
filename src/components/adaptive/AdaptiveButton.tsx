import React from 'react';
import { TouchableOpacity, ViewStyle, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useResponsive, platformStyles, isWeb } from '../../utils/platform';
import { COLORS, BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../../constants';
import AdaptiveText from './AdaptiveText';

interface AdaptiveButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
}

export const AdaptiveButton: React.FC<AdaptiveButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
}) => {
  const { screenSize } = useResponsive();
  
  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: COLORS.ACCENT_BLUE,
        borderColor: COLORS.ACCENT_BLUE,
        textColor: COLORS.WHITE,
      },
      secondary: {
        backgroundColor: COLORS.LIGHT_GRAY,
        borderColor: COLORS.LIGHT_GRAY,
        textColor: COLORS.TEXT_PRIMARY,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: COLORS.BORDER_GRAY,
        textColor: COLORS.TEXT_PRIMARY,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: COLORS.ACCENT_BLUE,
      },
      danger: {
        backgroundColor: COLORS.ERROR,
        borderColor: COLORS.ERROR,
        textColor: COLORS.WHITE,
      },
    };
    
    return variants[variant];
  };
  
  const getSizeStyles = () => {
    const sizes = {
      small: {
        paddingHorizontal: SPACING.SM,
        paddingVertical: SPACING.XS,
        fontSize: TYPOGRAPHY.FONT_SIZE.SM,
        minHeight: 32,
      },
      medium: {
        paddingHorizontal: SPACING.MD,
        paddingVertical: SPACING.SM,
        fontSize: TYPOGRAPHY.FONT_SIZE.BASE,
        minHeight: 40,
      },
      large: {
        paddingHorizontal: SPACING.LG,
        paddingVertical: SPACING.MD,
        fontSize: TYPOGRAPHY.FONT_SIZE.LG,
        minHeight: 48,
      },
    };
    
    return sizes[size];
  };
  
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  
  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BORDER_RADIUS.MD,
      borderWidth: 1,
      backgroundColor: variantStyles.backgroundColor,
      borderColor: variantStyles.borderColor,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      paddingVertical: sizeStyles.paddingVertical,
      minHeight: sizeStyles.minHeight,
      ...(fullWidth && { width: '100%' }),
      ...(disabled && {
        opacity: 0.5,
      }),
      ...platformStyles.elevation(variant === 'primary' ? 2 : 0),
      ...style,
    },
    buttonPressed: {
      opacity: 0.8,
      ...(variant === 'primary' && platformStyles.elevation(1)),
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconLeft: {
      marginRight: SPACING.XS,
    },
    iconRight: {
      marginLeft: SPACING.XS,
    },
    text: {
      fontSize: sizeStyles.fontSize,
      fontWeight: 'medium' as const,
      color: variantStyles.textColor,
    },
  });
  
  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variantStyles.textColor}
        />
      );
    }
    
    return (
      <View style={styles.content}>
        {icon && iconPosition === 'left' && (
          <View style={styles.iconLeft}>{icon}</View>
        )}
        <AdaptiveText style={styles.text}>{title}</AdaptiveText>
        {icon && iconPosition === 'right' && (
          <View style={styles.iconRight}>{icon}</View>
        )}
      </View>
    );
  };
  
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default AdaptiveButton;
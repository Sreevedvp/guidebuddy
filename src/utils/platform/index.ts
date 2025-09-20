import { Platform, Dimensions } from 'react-native';
import { PlatformConfig, ResponsiveBreakpoints } from '../../types';
import { BREAKPOINTS } from '../../constants';

// Platform detection
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

// Get current platform configuration
export const getPlatformConfig = (): PlatformConfig => {
  const { width } = Dimensions.get('window');
  
  return {
    platform: Platform.OS as 'ios' | 'android' | 'web',
    isTablet: width >= BREAKPOINTS.tablet && isMobile,
    screenSize: getScreenSize(width),
    hasNotifications: isMobile,
    hasCalendarAccess: isMobile,
    hasBiometrics: isMobile,
  };
};

// Screen size detection
export const getScreenSize = (width?: number): 'mobile' | 'tablet' | 'desktop' => {
  const screenWidth = width || Dimensions.get('window').width;
  
  if (screenWidth >= BREAKPOINTS.desktop) return 'desktop';
  if (screenWidth >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
};

// Responsive utilities
export const useResponsive = () => {
  const { width, height } = Dimensions.get('window');
  const screenSize = getScreenSize(width);
  
  return {
    width,
    height,
    screenSize,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
    isLandscape: width > height,
    isPortrait: width <= height,
  };
};

// Platform-specific styling
export const platformStyles = {
  // Elevation for Android, shadow for iOS
  elevation: (level: number) => ({
    ...(isAndroid && { elevation: level }),
    ...(isIOS && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: level },
      shadowOpacity: 0.1,
      shadowRadius: level,
    }),
    ...(isWeb && {
      boxShadow: `0 ${level}px ${level * 2}px rgba(0,0,0,0.1)`,
    }),
  }),
  
  // Safe area handling
  safeArea: {
    paddingTop: isIOS ? 44 : 0, // Status bar height
    paddingBottom: isIOS ? 34 : 0, // Home indicator
  },
  
  // Platform-specific font weights
  fontWeight: (weight: 'normal' | 'medium' | 'bold') => {
    if (isWeb) {
      return {
        normal: '400',
        medium: '500',
        bold: '700',
      }[weight];
    }
    return weight;
  },
};

// Breakpoint utilities
export const createBreakpointStyles = <T>(styles: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
}) => {
  const screenSize = getScreenSize();
  
  return {
    ...styles.mobile,
    ...(screenSize === 'tablet' && styles.tablet),
    ...(screenSize === 'desktop' && styles.desktop),
  };
};

// Web-specific utilities
export const webUtils = {
  // Check if running in PWA mode
  isPWA: () => {
    if (!isWeb) return false;
    return (window as any).navigator?.standalone === true ||
           window.matchMedia('(display-mode: standalone)').matches;
  },
  
  // Get browser info
  getBrowserInfo: () => {
    if (!isWeb) return null;
    
    const userAgent = navigator.userAgent;
    const isChrome = userAgent.includes('Chrome');
    const isFirefox = userAgent.includes('Firefox');
    const isSafari = userAgent.includes('Safari') && !isChrome;
    const isEdge = userAgent.includes('Edge');
    
    return { isChrome, isFirefox, isSafari, isEdge, userAgent };
  },
  
  // Keyboard shortcut utilities
  createKeyboardShortcut: (
    keys: string[],
    callback: () => void,
    options?: { ctrl?: boolean; meta?: boolean; alt?: boolean }
  ) => {
    if (!isWeb) return () => {};
    
    const handleKeydown = (event: KeyboardEvent) => {
      const { ctrl = false, meta = false, alt = false } = options || {};
      
      const modifierMatch = 
        event.ctrlKey === ctrl &&
        event.metaKey === meta &&
        event.altKey === alt;
      
      const keyMatch = keys.includes(event.key.toLowerCase());
      
      if (modifierMatch && keyMatch) {
        event.preventDefault();
        callback();
      }
    };
    
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  },
};

// Mobile-specific utilities
export const mobileUtils = {
  // Haptic feedback
  hapticFeedback: (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!isMobile) return;
    
    // This would require expo-haptics
    // import * as Haptics from 'expo-haptics';
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle[style.charAt(0).toUpperCase() + style.slice(1)]);
  },
  
  // Status bar utilities
  setStatusBarStyle: (style: 'light' | 'dark') => {
    if (!isMobile) return;
    
    // This would require expo-status-bar
    // import { setStatusBarStyle } from 'expo-status-bar';
    // setStatusBarStyle(style);
  },
  
  // Screen orientation
  getOrientation: () => {
    const { width, height } = Dimensions.get('window');
    return width > height ? 'landscape' : 'portrait';
  },
};

// Layout utilities for responsive design
export const layoutUtils = {
  // Calculate number of columns for grid layouts
  getGridColumns: (itemWidth: number, containerWidth?: number) => {
    const screenWidth = containerWidth || Dimensions.get('window').width;
    const padding = 32; // Account for padding
    const availableWidth = screenWidth - padding;
    return Math.floor(availableWidth / itemWidth);
  },
  
  // Get sidebar width based on screen size
  getSidebarWidth: () => {
    const screenSize = getScreenSize();
    
    switch (screenSize) {
      case 'desktop':
        return 280;
      case 'tablet':
        return 240;
      default:
        return 0; // Hidden on mobile
    }
  },
  
  // Get content padding based on screen size
  getContentPadding: () => {
    const screenSize = getScreenSize();
    
    switch (screenSize) {
      case 'desktop':
        return { paddingHorizontal: 32, paddingVertical: 24 };
      case 'tablet':
        return { paddingHorizontal: 24, paddingVertical: 16 };
      default:
        return { paddingHorizontal: 16, paddingVertical: 12 };
    }
  },
  
  // Get maximum content width
  getMaxContentWidth: () => {
    const screenSize = getScreenSize();
    
    switch (screenSize) {
      case 'desktop':
        return 1200;
      case 'tablet':
        return 768;
      default:
        return '100%';
    }
  },
};

// Navigation utilities
export const navigationUtils = {
  // Get navigation type based on platform and screen size
  getNavigationType: () => {
    if (isWeb && getScreenSize() === 'desktop') {
      return 'sidebar';
    } else if (getScreenSize() === 'tablet') {
      return 'drawer';
    } else {
      return 'tabs';
    }
  },
  
  // Check if navigation should be persistent
  isPersistentNavigation: () => {
    return isWeb && getScreenSize() === 'desktop';
  },
};

// Performance utilities
export const performanceUtils = {
  // Debounce function for search and input
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },
  
  // Throttle function for scroll events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0;
    
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  },
};

export default {
  isWeb,
  isIOS,
  isAndroid,
  isMobile,
  getPlatformConfig,
  getScreenSize,
  useResponsive,
  platformStyles,
  createBreakpointStyles,
  webUtils,
  mobileUtils,
  layoutUtils,
  navigationUtils,
  performanceUtils,
};
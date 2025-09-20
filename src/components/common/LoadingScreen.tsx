import React from 'react';
import { ActivityIndicator } from 'react-native';
import AdaptiveView from '../adaptive/AdaptiveView';
import AdaptiveText from '../adaptive/AdaptiveText';
import { COLORS } from '../../constants';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <AdaptiveView 
      fullHeight 
      centered 
      backgroundColor={COLORS.LIGHT_GRAY}
    >
      <ActivityIndicator 
        size="large" 
        color={COLORS.ACCENT_BLUE} 
        style={{ marginBottom: 16 }}
      />
      <AdaptiveText 
        variant="h3" 
        color={COLORS.TEXT_SECONDARY}
        align="center"
      >
        {message}
      </AdaptiveText>
    </AdaptiveView>
  );
};

export default LoadingScreen;
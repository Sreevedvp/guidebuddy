import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import navigation components
import AppNavigator from './src/navigation/AppNavigator';

// Import services
import { storageService } from './src/services/storage/storageService';
import { geminiService } from './src/services/ai/geminiService';

// Import utilities
import { isWeb } from './src/utils/platform';
import { COLORS } from './src/constants';

// Import components
import LoadingScreen from './src/components/common/LoadingScreen';
import AdaptiveView from './src/components/adaptive/AdaptiveView';
import AdaptiveText from './src/components/adaptive/AdaptiveText';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize storage and check for API key
      const apiKeyExists = await storageService.hasApiKey();
      setHasApiKey(apiKeyExists);
      
      // Set up AI service if API key exists
      if (apiKeyExists) {
        const apiKey = await storageService.getApiKey();
        if (apiKey) {
          await geminiService.setApiKey(apiKey);
        }
      }
      
      // Platform-specific setup
      if (isWeb) {
        // Web-specific initialization
        document.title = 'AI Project Planner';
      }
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <AdaptiveView fullHeight centered backgroundColor={COLORS.LIGHT_GRAY}>
          <AdaptiveText variant="h2" color={COLORS.TEXT_SECONDARY}>
            Loading AI Project Planner...
          </AdaptiveText>
        </AdaptiveView>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator hasApiKey={hasApiKey} />
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
});

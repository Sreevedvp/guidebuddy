import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import navigation components
import AppNavigator from './src/navigation/AppNavigator';

// Import services
import { storageService } from './src/services/storage/storageService';
import { geminiService } from './src/services/ai/geminiService';

// Import utilities
import { isWeb } from './src/utils/platform';
import { THEME } from './src/constants';

// Import components
import AdaptiveView from './src/components/adaptive/AdaptiveView';
import AdaptiveText from './src/components/adaptive/AdaptiveText';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme || 'light'];

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
        <AdaptiveView fullHeight centered backgroundColor={theme.colors.gray}>
          <AdaptiveText variant="h2" color={theme.colors.textGray}>
            Loading AI Project Planner...
          </AdaptiveText>
        </AdaptiveView>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaProvider>
    );
  }

  const handleApiKeySet = () => {
    setHasApiKey(true);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator hasApiKey={hasApiKey} onApiKeySet={handleApiKeySet} />
      </NavigationContainer>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

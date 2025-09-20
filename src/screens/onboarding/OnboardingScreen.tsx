import React, { useState } from 'react';
import { TextInput, StyleSheet, Alert } from 'react-native';
import AdaptiveView from '../../components/adaptive/AdaptiveView';
import AdaptiveText from '../../components/adaptive/AdaptiveText';
import AdaptiveButton from '../../components/adaptive/AdaptiveButton';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants';
import { geminiService } from '../../services/ai/geminiService';
import { storageService } from '../../services/storage/storageService';

interface OnboardingScreenProps {
  onApiKeySet: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter your Gemini API key');
      return;
    }

    setIsLoading(true);
    try {
      await geminiService.setApiKey(apiKey.trim());
      await storageService.setOnboardingCompleted(true);
      onApiKeySet();
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key. Please try again.');
      console.error('API key save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdaptiveView fullHeight padding="LG" backgroundColor={COLORS.WHITE}>
      <AdaptiveView centered style={{ flex: 1 }}>
        <AdaptiveText variant="h1" align="center" style={{ marginBottom: SPACING.XL }}>
          Welcome to AI Project Planner
        </AdaptiveText>
        
        <AdaptiveText 
          variant="body" 
          align="center" 
          color={COLORS.TEXT_SECONDARY}
          style={{ marginBottom: SPACING.XXL, maxWidth: 400 }}
        >
          Transform your ideas into comprehensive project plans with AI. 
          To get started, you'll need a Google Gemini API key.
        </AdaptiveText>

        <AdaptiveView style={{ width: '100%', maxWidth: 400 }}>
          <AdaptiveText variant="label" style={{ marginBottom: SPACING.SM }}>
            Gemini API Key
          </AdaptiveText>
          
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your Gemini API key"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <AdaptiveButton
            title="Get Started"
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
            style={{ marginTop: SPACING.LG }}
          />
          
          <AdaptiveText 
            variant="caption" 
            align="center"
            color={COLORS.TEXT_SECONDARY}
            style={{ marginTop: SPACING.MD }}
          >
            Your API key is stored securely on your device
          </AdaptiveText>
        </AdaptiveView>
      </AdaptiveView>
    </AdaptiveView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER_GRAY,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: COLORS.WHITE,
  },
});

export default OnboardingScreen;
import React from 'react';
import AdaptiveView from '../../components/adaptive/AdaptiveView';
import AdaptiveText from '../../components/adaptive/AdaptiveText';
import AdaptiveButton from '../../components/adaptive/AdaptiveButton';
import { COLORS, SPACING } from '../../constants';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  navigation?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleCreatePlan = () => {
    navigation?.navigate?.('CreatePlan');
  };

  return (
    <AdaptiveView fullHeight padding="LG" backgroundColor={COLORS.LIGHT_GRAY}>
      <AdaptiveView style={{ marginBottom: SPACING.XL }}>
        <AdaptiveText variant="h1" style={{ marginBottom: SPACING.SM }}>
          My Projects
        </AdaptiveText>
        <AdaptiveText variant="body" color={COLORS.TEXT_SECONDARY}>
          Transform your ideas into actionable project plans with AI
        </AdaptiveText>
      </AdaptiveView>

      <AdaptiveView centered style={{ flex: 1 }}>
        <Ionicons 
          name="bulb-outline" 
          size={80} 
          color={COLORS.TEXT_SECONDARY} 
          style={{ marginBottom: SPACING.LG }}
        />
        
        <AdaptiveText 
          variant="h3" 
          align="center" 
          style={{ marginBottom: SPACING.MD }}
        >
          Ready to start your next project?
        </AdaptiveText>
        
        <AdaptiveText 
          variant="body" 
          align="center" 
          color={COLORS.TEXT_SECONDARY}
          style={{ marginBottom: SPACING.XL, maxWidth: 300 }}
        >
          Create comprehensive project plans with AI-powered roadmaps, 
          task breakdowns, and intelligent scheduling.
        </AdaptiveText>

        <AdaptiveButton
          title="Create New Project"
          onPress={handleCreatePlan}
          variant="primary"
          size="large"
          icon={<Ionicons name="add" size={20} color={COLORS.WHITE} />}
        />
      </AdaptiveView>
    </AdaptiveView>
  );
};

export default HomeScreen;
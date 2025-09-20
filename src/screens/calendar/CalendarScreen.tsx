import React from 'react';
import AdaptiveView from '../../components/adaptive/AdaptiveView';
import AdaptiveText from '../../components/adaptive/AdaptiveText';
import { COLORS } from '../../constants';

const CalendarScreen: React.FC = () => {
  return (
    <AdaptiveView fullHeight centered backgroundColor={COLORS.WHITE}>
      <AdaptiveText variant="h2">Calendar Screen</AdaptiveText>
      <AdaptiveText variant="body" color={COLORS.TEXT_SECONDARY}>
        Coming soon...
      </AdaptiveText>
    </AdaptiveView>
  );
};

export default CalendarScreen;
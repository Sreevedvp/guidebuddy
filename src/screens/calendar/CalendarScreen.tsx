import React, { useState, useEffect } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import Animated, { FadeIn } from 'react-native-reanimated';
import AdaptiveView from '../../components/adaptive/AdaptiveView';
import AdaptiveText from '../../components/adaptive/AdaptiveText';
import { THEME } from '../../constants';
import { storageService } from '../../services/storage/storageService';
import { ProjectPlan } from '../../types';
import { format } from 'date-fns';

const CalendarScreen: React.FC = () => {
  const [markedDates, setMarkedDates] = useState({});
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme] || THEME.light;

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await storageService.getAllProjects();
      console.log('Fetched projects:', projects);
      const newMarkedDates = {};

      projects.forEach(project => {
        const { startDate, endDate } = project.schedule;
        const start = new Date(startDate);
        const end = new Date(endDate);

        let current = new Date(start);
        while (current <= end) {
          const dateString = format(current, 'yyyy-MM-dd');
          newMarkedDates[dateString] = {
            marked: true,
            dotColor: theme.blue,
          };
          current.setDate(current.getDate() + 1);
        }
      });

      console.log('Created marked dates:', newMarkedDates);
      setMarkedDates(newMarkedDates);
    };

    fetchProjects();
  }, [theme]);

  return (
    <AdaptiveView fullHeight backgroundColor={theme.background} style={styles.container}>
      <AdaptiveText variant="h2" style={styles.title} color={theme.text}>
        Project Calendar
      </AdaptiveText>
      <Animated.View entering={FadeIn.duration(500)}>
        <Calendar
          markedDates={markedDates}
          theme={{
            backgroundColor: theme.background,
            calendarBackground: theme.background,
            textSectionTitleColor: theme.textGray,
            selectedDayBackgroundColor: theme.blue,
            selectedDayTextColor: colorScheme === 'dark' ? theme.text : theme.white,
            todayTextColor: theme.blue,
            dayTextColor: theme.text,
            textDisabledColor: theme.textGray,
            arrowColor: theme.blue,
            monthTextColor: theme.text,
            indicatorColor: theme.blue,
            textDayFontFamily: THEME.light.TYPOGRAPHY.FONT_FAMILY.REGULAR,
            textMonthFontFamily: THEME.light.TYPOGRAPHY.FONT_FAMILY.REGULAR,
            textDayHeaderFontFamily: THEME.light.TYPOGRAPHY.FONT_FAMILY.REGULAR,
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
        />
      </Animated.View>
    </AdaptiveView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default CalendarScreen;
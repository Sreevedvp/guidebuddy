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
  const theme = THEME[colorScheme || 'light'];

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
            dotColor: theme.colors.blue,
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
    <AdaptiveView fullHeight backgroundColor={theme.colors.background} style={styles.container}>
      <AdaptiveText variant="h2" style={styles.title} color={theme.colors.text}>
        Project Calendar
      </AdaptiveText>
      <Animated.View entering={FadeIn.duration(500)}>
        <Calendar
          markedDates={markedDates}
          theme={{
            backgroundColor: theme.colors.background,
            calendarBackground: theme.colors.background,
            textSectionTitleColor: theme.colors.textGray,
            selectedDayBackgroundColor: theme.colors.blue,
            selectedDayTextColor: colorScheme === 'dark' ? theme.colors.text : theme.colors.white,
            todayTextColor: theme.colors.blue,
            dayTextColor: theme.colors.text,
            textDisabledColor: theme.colors.textGray,
            arrowColor: theme.colors.blue,
            monthTextColor: theme.colors.text,
            indicatorColor: theme.colors.blue,
            textDayFontFamily: theme.fonts.REGULAR,
            textMonthFontFamily: theme.fonts.REGULAR,
            textDayHeaderFontFamily: theme.fonts.REGULAR,
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
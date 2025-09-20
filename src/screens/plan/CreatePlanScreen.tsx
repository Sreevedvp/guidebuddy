import React, { useState } from 'react';
import { TextInput, StyleSheet, Button, Alert, useColorScheme } from 'react-native';
import AdaptiveView from '../../components/adaptive/AdaptiveView';
import AdaptiveText from '../../components/adaptive/AdaptiveText';
import { THEME } from '../../constants';
import { storageService } from '../../services/storage/storageService';
import { ProjectPlan } from '../../types';
import { parseISO } from 'date-fns';

const CreatePlanScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme] || THEME.light;

  const handleCreatePlan = async () => {
    if (!title || !description || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const parsedStartDate = parseISO(startDate);
    const parsedEndDate = parseISO(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      Alert.alert('Error', 'Invalid date format. Please use YYYY-MM-DD.');
      return;
    }

    const fullPlan: ProjectPlan = {
        id: Date.now().toString(),
        title,
        description,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        aiGenerated: {
            originalIdea: '',
            guide: '',
            roadmap: [],
            estimatedDuration: 0,
            complexity: 'medium',
            generatedAt: new Date(),
        },
        customizations: {
            userNotes: '',
            priorityAdjustments: {},
            timelineAdjustments: {},
            customTasks: [],
        },
        schedule: {
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            milestones: [],
            workingDays: [1, 2, 3, 4, 5],
            dailyWorkHours: 8,
            timezone: 'UTC',
        },
        progress: {
            completionPercentage: 0,
            completedTasks: 0,
            totalTasks: 0,
            currentPhase: '',
            velocity: 0,
            estimatedCompletionDate: parsedEndDate,
            timeSpent: 0,
        },
    };

    try {
      console.log('Saving project:', fullPlan);
      await storageService.saveProject(fullPlan);
      Alert.alert('Success', 'Project plan saved successfully!');
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save project plan.');
      console.error('Failed to save project:', error);
    }
  };

  return (
    <AdaptiveView fullHeight backgroundColor={theme.background} style={styles.container}>
      <AdaptiveText variant="h2" style={styles.title} color={theme.text}>
        Create a New Plan
      </AdaptiveText>

      <TextInput
        style={[styles.input, { backgroundColor: theme.gray, color: theme.text, borderColor: theme.gray }]}
        placeholder="Project Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={theme.textGray}
      />
      <TextInput
        style={[styles.input, styles.multilineInput, { backgroundColor: theme.gray, color: theme.text, borderColor: theme.gray }]}
        placeholder="Project Description"
        value={description}
        onChangeText={setDescription}
        multiline
        placeholderTextColor={theme.textGray}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.gray, color: theme.text, borderColor: theme.gray }]}
        placeholder="Start Date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
        placeholderTextColor={theme.textGray}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.gray, color: theme.text, borderColor: theme.gray }]}
        placeholder="End Date (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
        placeholderTextColor={theme.textGray}
      />
      <Button title="Create Plan" onPress={handleCreatePlan} color={theme.blue} />
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
  input: {
    height: 50,
    borderColor: THEME.light.gray,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
});

export default CreatePlanScreen;
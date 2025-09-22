import React, { useState } from 'react';
import { TextInput, StyleSheet, Button, Alert, useColorScheme, View, ActivityIndicator } from 'react-native';
import AdaptiveView from '../../components/adaptive/AdaptiveView';
import AdaptiveText from '../../components/adaptive/AdaptiveText';
import { THEME } from '../../constants';
import { storageService } from '../../services/storage/storageService';
import { geminiService } from '../../services/ai/geminiService';
import { ProjectPlan } from '../../types';
import { Picker } from '@react-native-picker/picker';

const CreatePlanScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme || 'light'];

  const handleCreatePlan = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await geminiService.generateRoadmap(title, description, duration, complexity);

      if (response.error || !response.content) {
        Alert.alert('Error', response.error || 'Failed to generate project plan.');
        setIsLoading(false);
        return;
      }

      const parsedPlan = geminiService.parseProjectAnalysis(response.content);

      if (!parsedPlan) {
        Alert.alert('Error', 'Failed to parse project plan.');
        setIsLoading(false);
        return;
      }

      const newProject: ProjectPlan = {
        ...parsedPlan,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        customizations: {
            userNotes: '',
            priorityAdjustments: {},
            timelineAdjustments: {},
            customTasks: [],
        },
        schedule: {
            startDate: new Date(),
            endDate: new Date(Date.now() + (parsedPlan.aiGenerated?.estimatedDuration || 30) * 24 * 60 * 60 * 1000),
            milestones: [],
            workingDays: [1, 2, 3, 4, 5],
            dailyWorkHours: 8,
            timezone: 'UTC',
        },
        progress: {
            completionPercentage: 0,
            completedTasks: 0,
            totalTasks: parsedPlan.aiGenerated?.roadmap.reduce((acc, phase) => acc + phase.tasks.length, 0) || 0,
            currentPhase: parsedPlan.aiGenerated?.roadmap[0]?.id || '',
            velocity: 0,
            estimatedCompletionDate: new Date(Date.now() + (parsedPlan.aiGenerated?.estimatedDuration || 30) * 24 * 60 * 60 * 1000),
            timeSpent: 0,
        },
      };

      await storageService.saveProject(newProject);
      Alert.alert('Success', 'Project plan created successfully!');
      setTitle('');
      setDescription('');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdaptiveView fullHeight backgroundColor={theme.colors.background} style={styles.container}>
      <AdaptiveText variant="h2" style={styles.title} color={theme.colors.text}>
        Create a New Plan
      </AdaptiveText>

      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.gray, color: theme.colors.text, borderColor: theme.colors.gray }]}
        placeholder="Project Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={theme.colors.textGray}
      />
      <TextInput
        style={[styles.input, styles.multilineInput, { backgroundColor: theme.colors.gray, color: theme.colors.text, borderColor: theme.colors.gray }]}
        placeholder="Project Description"
        value={description}
        onChangeText={setDescription}
        multiline
        placeholderTextColor={theme.colors.textGray}
      />
      <View style={styles.pickerContainer}>
        <AdaptiveText color={theme.colors.text}>Duration (days):</AdaptiveText>
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 10, color: theme.colors.text }]}
          keyboardType="numeric"
          value={duration.toString()}
          onChangeText={(text) => setDuration(Number(text))}
          placeholderTextColor={theme.colors.textGray}
        />
      </View>
      <View style={styles.pickerContainer}>
        <AdaptiveText color={theme.colors.text}>Complexity:</AdaptiveText>
        <Picker
          selectedValue={complexity}
          style={[styles.picker, { color: theme.colors.text }]}
          onValueChange={(itemValue) => setComplexity(itemValue)}
        >
          <Picker.Item label="Low" value="low" />
          <Picker.Item label="Medium" value="medium" />
          <Picker.Item label="High" value="high" />
        </Picker>
      </View>
      <Button title={isLoading ? "Generating..." : "Create Plan with AI"} onPress={handleCreatePlan} color={theme.colors.blue} disabled={isLoading} />
      {isLoading && <ActivityIndicator size="large" color={theme.colors.blue} style={styles.activityIndicator} />}
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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  activityIndicator: {
    marginTop: 20,
  }
});

export default CreatePlanScreen;
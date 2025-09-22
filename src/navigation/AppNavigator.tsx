import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

// Import types
import { RootStackParamList, TabParamList } from '../types';

// Import utilities
import { navigationUtils, useResponsive, isWeb } from '../utils/platform';
import { THEME } from '../constants';

// Import screens (we'll create these next)
import HomeScreen from '../screens/home/HomeScreen';
import CreatePlanScreen from '../screens/plan/CreatePlanScreen';
import PlanDetailsScreen from '../screens/plan/PlanDetailsScreen';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator();

interface AppNavigatorProps {
  hasApiKey: boolean;
  onApiKeySet: () => void;
}

// Tab Navigator for mobile
const TabNavigator = () => {
  const { screenSize } = useResponsive();
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme || 'light'];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Plans') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.blue,
        tabBarInactiveTintColor: theme.colors.textGray,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.gray,
          paddingBottom: screenSize === 'mobile' ? 8 : 0,
          height: screenSize === 'mobile' ? 60 : 50,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Plans" 
        component={HomeScreen} 
        options={{ title: 'Projects' }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen} 
      />
    </Tab.Navigator>
  );
};


// Root Stack Navigator that contains tabs and modal screens
const RootStackNavigator = () => {
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme || 'light'];

  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={TabNavigator}
      />
      <Stack.Screen 
        name="CreatePlan" 
        component={CreatePlanScreen}
        options={{ 
          presentation: 'modal',
          headerShown: true,
          title: 'Create New Plan',
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
        }}
      />
      <Stack.Screen 
        name="PlanDetails" 
        component={PlanDetailsScreen}
        options={{ 
          headerShown: true,
          title: 'Project Details',
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
        }}
      />
    </Stack.Navigator>
  );
};

// Main App Navigator
const AppNavigator: React.FC<AppNavigatorProps> = ({ hasApiKey, onApiKeySet }) => {
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme || 'light'];

  // If no API key, show onboarding
  if (!hasApiKey) {
    return (
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background }
        }}
      >
        <Stack.Screen name="Onboarding">
          {(props) => <OnboardingScreen {...props} onApiKeySet={onApiKeySet} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  // Return the main app with root stack navigator
  return <RootStackNavigator />;
};

export default AppNavigator;
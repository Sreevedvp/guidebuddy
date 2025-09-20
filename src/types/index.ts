// Core data types for the AI Project Planner

export interface ProjectPlan {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'active' | 'completed' | 'paused';
  aiGenerated: AIGeneratedContent;
  customizations: UserCustomizations;
  schedule: ProjectSchedule;
  progress: ProjectProgress;
}

export interface AIGeneratedContent {
  originalIdea: string;
  guide: string;
  roadmap: Phase[];
  estimatedDuration: number; // in days
  complexity: 'low' | 'medium' | 'high';
  generatedAt: Date;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedDuration: number; // in days
  prerequisites: string[]; // phase IDs
  deliverables: string[];
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  phaseId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed' | 'blocked';
  estimatedHours: number;
  actualHours?: number;
  scheduledDate?: Date;
  completedDate?: Date;
  dependencies: string[]; // task IDs
  tags: string[];
  assignee?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  phaseId: string;
  criteria: string[];
  status: 'upcoming' | 'in-progress' | 'completed' | 'overdue';
}

export interface UserCustomizations {
  modifiedRoadmap?: Phase[];
  userNotes: string;
  priorityAdjustments: Record<string, 'low' | 'medium' | 'high'>;
  timelineAdjustments: Record<string, number>; // task ID -> adjusted hours
  customTasks: Task[];
}

export interface ProjectSchedule {
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  workingDays: number[]; // 0-6, Sunday-Saturday
  dailyWorkHours: number;
  timezone: string;
}

export interface ProjectProgress {
  completionPercentage: number;
  completedTasks: number;
  totalTasks: number;
  currentPhase: string;
  nextMilestone?: Milestone;
  velocity: number; // tasks per day
  estimatedCompletionDate: Date;
  timeSpent: number; // hours
}

// AI Service Types
export interface GeminiAPIRequest {
  prompt: string;
  context?: string;
  parameters?: GeminiParameters;
}

export interface GeminiParameters {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface GeminiAPIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
}

export interface AIPromptTemplate {
  id: string;
  name: string;
  category: 'analysis' | 'roadmap' | 'tasks' | 'scheduling';
  template: string;
  variables: string[];
  description: string;
}

// Calendar and Scheduling Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  taskId?: string;
  type: 'task' | 'milestone' | 'meeting' | 'deadline';
  reminder?: number; // minutes before
  recurring?: RecurringPattern;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate?: Date;
  occurrences?: number;
}

// UI and Navigation Types
export type RootStackParamList = {
  Home: undefined;
  CreatePlan: { idea?: string };
  PlanDetails: { planId: string };
  PlanEdit: { planId: string };
  Calendar: { planId?: string };
  Settings: undefined;
  TaskDetails: { taskId: string; planId: string };
  Onboarding: undefined;
  Main: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Plans: undefined;
  Calendar: undefined;
  Profile: undefined;
};

// Platform-specific types
export type Platform = 'ios' | 'android' | 'web';

export interface PlatformConfig {
  platform: Platform;
  isTablet?: boolean;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  hasNotifications: boolean;
  hasCalendarAccess: boolean;
  hasBiometrics: boolean;
}

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

// Storage Types
export interface StorageConfig {
  apiKey?: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    enabled: boolean;
    deadlines: boolean;
    milestones: boolean;
    dailyReminders: boolean;
  };
  calendar: {
    defaultView: 'month' | 'week' | 'day';
    workingDays: number[];
    workingHours: { start: number; end: number };
  };
  ai: {
    defaultPromptStyle: 'detailed' | 'concise' | 'technical';
    autoGenerateSchedule: boolean;
    preferredComplexity: 'low' | 'medium' | 'high';
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  context?: string;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Export utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
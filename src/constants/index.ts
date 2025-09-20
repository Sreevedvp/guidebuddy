import { ResponsiveBreakpoints } from '../types';
import { COLORS as THEME_COLORS, FONTS as THEME_FONTS } from './theme';

// Theme Configuration - Notion-inspired design
export const COLORS = {
  // Primary colors
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F7F6F3',
  BORDER_GRAY: '#EBECED',
  ACCENT_BLUE: '#2383E2',
  TEXT_PRIMARY: '#2F3437',
  TEXT_SECONDARY: '#787774',
  
  // Status colors
  SUCCESS: '#00B865',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  
  // Priority colors
  PRIORITY_LOW: '#10B981',
  PRIORITY_MEDIUM: '#F59E0B',
  PRIORITY_HIGH: '#EF4444',
  
  // Phase colors
  PHASE_PLANNING: '#8B5CF6',
  PHASE_DEVELOPMENT: '#3B82F6',
  PHASE_TESTING: '#F59E0B',
  PHASE_DEPLOYMENT: '#10B981',
  
  // Background variations
  BACKGROUND_LIGHT: '#FAFAFA',
  BACKGROUND_CARD: '#FFFFFF',
  BACKGROUND_OVERLAY: 'rgba(0, 0, 0, 0.5)',
  
  // Dark mode (optional for future implementation)
  DARK: {
    BACKGROUND: '#1A1A1A',
    SURFACE: '#2D2D2D',
    TEXT_PRIMARY: '#FFFFFF',
    TEXT_SECONDARY: '#A1A1AA',
    BORDER: '#404040',
  }
};

export const THEME = {
  light: {
    ...COLORS,
    ...THEME_COLORS.light,
  },
  dark: {
    ...COLORS,
    ...THEME_COLORS.dark,
  }
};

// Typography
export const TYPOGRAPHY = {
  FONT_FAMILY: {
    REGULAR: THEME_FONTS.primary,
    MEDIUM: THEME_FONTS.primary,
    BOLD: THEME_FONTS.primary,
  },
  FONT_SIZE: {
    XS: 12,
    SM: 14,
    BASE: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
    XXXL: 32,
  },
  LINE_HEIGHT: {
    TIGHT: 1.25,
    NORMAL: 1.5,
    RELAXED: 1.75,
  }
};

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
  XXXL: 64,
};

// Responsive Breakpoints
export const BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
};

// Border Radius
export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  ROUND: 50,
};

// Shadow configurations
export const SHADOWS = {
  SM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  MD: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  LG: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
};

// Animation durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// API Configuration
export const API_CONFIG = {
  GEMINI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Storage Keys
export const STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  USER_SETTINGS: 'user_settings',
  PROJECTS: 'projects',
  THEME: 'theme_preference',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LAST_SYNC: 'last_sync_timestamp',
};

// Default Settings
export const DEFAULT_SETTINGS = {
  theme: 'light' as const,
  notifications: {
    enabled: true,
    deadlines: true,
    milestones: true,
    dailyReminders: false,
  },
  calendar: {
    defaultView: 'month' as const,
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    workingHours: { start: 9, end: 17 },
  },
  ai: {
    defaultPromptStyle: 'detailed' as const,
    autoGenerateSchedule: true,
    preferredComplexity: 'medium' as const,
  },
};

// AI Prompt Templates
export const AI_PROMPT_TEMPLATES = {
  PROJECT_ANALYSIS: `Analyze the following project idea and create a comprehensive development plan:

Project Idea: {idea}
Additional Context: {context}

Please provide:
1. A detailed project guide explaining the concept, goals, and potential challenges
2. A structured roadmap with phases, each including:
   - Phase name and description
   - Key deliverables
   - Estimated duration
   - Prerequisites and dependencies
3. Timeline estimates for the entire project
4. Complexity assessment (low/medium/high)
5. Resource requirements and recommendations

Format your response as structured data that can be parsed into our application.`,

  ROADMAP_GENERATION: `Create a detailed project roadmap for the following project:

Project: {title}
Description: {description}
Estimated Duration: {duration} days
Complexity: {complexity}

Break down into phases with:
- Clear phase objectives
- Specific deliverables
- Task breakdowns
- Time estimates
- Dependencies between phases
- Success criteria for each phase`,

  TASK_BREAKDOWN: `Break down the following project phase into specific, actionable tasks:

Phase: {phaseTitle}
Description: {phaseDescription}
Duration: {duration} days
Deliverables: {deliverables}

For each task, provide:
- Clear, actionable title
- Detailed description
- Estimated hours
- Priority level (low/medium/high)
- Dependencies on other tasks
- Skills/resources required`,

  SCHEDULE_OPTIMIZATION: `Optimize the scheduling for the following project tasks:

Tasks: {tasks}
Working Days: {workingDays}
Daily Work Hours: {dailyHours}
Start Date: {startDate}
Dependencies: {dependencies}

Provide an optimized schedule considering:
- Task dependencies
- Resource allocation
- Buffer time for unexpected issues
- Milestone alignment
- Realistic time estimates`
};

// Platform-specific configurations
export const PLATFORM_CONFIG = {
  WEB: {
    SIDEBAR_WIDTH: 280,
    HEADER_HEIGHT: 64,
    MAX_CONTENT_WIDTH: 1200,
    KEYBOARD_SHORTCUTS: {
      NEW_PLAN: 'cmd+n',
      SAVE: 'cmd+s',
      SEARCH: 'cmd+f',
      CLOSE_MODAL: 'escape',
    },
  },
  MOBILE: {
    TAB_BAR_HEIGHT: 60,
    HEADER_HEIGHT: 56,
    BOTTOM_SHEET_SNAP_POINTS: ['25%', '50%', '90%'],
    GESTURE_THRESHOLD: 50,
  },
};

// Calendar Configuration
export const CALENDAR_CONFIG = {
  VIEWS: ['month', 'week', 'day'] as const,
  FIRST_DAY_OF_WEEK: 1, // Monday
  WORKING_HOURS: {
    START: 9,
    END: 17,
  },
  TIME_SLOTS: {
    DURATION: 30, // minutes
    START: 0, // 00:00
    END: 24 * 60, // 24:00
  },
  COLORS: {
    TASK: COLORS.ACCENT_BLUE,
    MILESTONE: COLORS.SUCCESS,
    DEADLINE: COLORS.ERROR,
    MEETING: COLORS.WARNING,
  },
};

// Validation Rules
export const VALIDATION = {
  PROJECT_TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  PROJECT_DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
  },
  TASK_TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 200,
  },
  API_KEY: {
    MIN_LENGTH: 20,
    PATTERN: /^[A-Za-z0-9_-]+$/,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  API_KEY_INVALID: 'Invalid API key. Please check your Gemini API key in settings.',
  API_RATE_LIMIT: 'API rate limit exceeded. Please try again later.',
  STORAGE_ERROR: 'Failed to save data locally. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROJECT_CREATED: 'Project plan created successfully!',
  PROJECT_UPDATED: 'Project plan updated successfully!',
  TASK_COMPLETED: 'Task marked as completed!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  API_KEY_SAVED: 'API key saved securely!',
};

// Feature Flags (for gradual rollout)
export const FEATURE_FLAGS = {
  CALENDAR_INTEGRATION: true,
  VOICE_INPUT: true,
  COLLABORATION: false, // Phase 2 feature
  ANALYTICS: false, // Phase 2 feature
  DARK_MODE: true, // Phase 2 feature
};

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BREAKPOINTS,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATION,
  API_CONFIG,
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  AI_PROMPT_TEMPLATES,
  PLATFORM_CONFIG,
  CALENDAR_CONFIG,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURE_FLAGS,
};
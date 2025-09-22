import { ResponsiveBreakpoints } from '../types';

const lightColors = {
  background: '#FFFFFF',
  white: '#FFFFFF',
  text: '#373530',
  gray: '#F1F1EF',
  brown: '#F3EEEE',
  orange: '#F8ECDF',
  yellow: '#FAF3DD',
  green: '#EEF3ED',
  blue: '#487CA5', // Using the darker blue for accents
  purple: '#F6F3F8',
  pink: '#F9F2F5',
  red: '#FAECEC',
  textGray: '#787774',
  textBrown: '#976D57',
  textOrange: '#CC782F',
  textYellow: '#C29343',
  textGreen: '#548164',
  textBlue: '#487CA5',
  textPurple: '#8A67AB',
  textPink: '#B35488',
  textRed: '#C4554D',
  // Specific constants that were used before
  ACCENT_BLUE: '#2383E2',
  TEXT_PRIMARY: '#2F3437',
  TEXT_SECONDARY: '#787774',
  BORDER_GRAY: '#EBECED',
};

const darkColors = {
  background: '#191919',
  text: '#D4D4D4',
  gray: '#252525',
  brown: '#2E2724',
  orange: '#36291F',
  yellow: '#372E20',
  green: '#242B26',
  blue: '#447ACB', // Using the lighter blue for accents
  purple: '#2A2430',
  pink: '#2E2328',
  red: '#332523',
  textGray: '#9B9B9B',
  textBrown: '#A27763',
  textOrange: '#CB7B37',
  textYellow: '#C19138',
  textGreen: '#4F9768',
  textBlue: '#447ACB',
  textPurple: '#865DBB',
  textPink: '#BA4A78',
  textRed: '#BE524B',
  // Specific constants that were used before
  ACCENT_BLUE: '#447ACB',
  TEXT_PRIMARY: '#D4D4D4',
  TEXT_SECONDARY: '#9B9B9B',
  BORDER_GRAY: '#404040',
};

export const FONTS = {
  primary: 'Lato, sans-serif',
  monospace: 'monospace',
};

export const TYPOGRAPHY = {
  FONT_FAMILY: {
    REGULAR: FONTS.primary,
    MEDIUM: FONTS.primary,
    BOLD: FONTS.primary,
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

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
  XXXL: 64,
};

export const THEME = {
  light: {
    colors: lightColors,
    fonts: TYPOGRAPHY.FONT_FAMILY,
    fontSizes: TYPOGRAPHY.FONT_SIZE,
    spacing: SPACING,
  },
  dark: {
    colors: darkColors,
    fonts: TYPOGRAPHY.FONT_FAMILY,
    fontSizes: TYPOGRAPHY.FONT_SIZE,
    spacing: SPACING,
  },
};

// ... (rest of the constants from the original index.ts)

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
    TASK: lightColors.ACCENT_BLUE,
    MILESTONE: '#00B865',
    DEADLINE: '#EF4444',
    MEETING: '#F59E0B',
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
  THEME,
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
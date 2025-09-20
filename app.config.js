export default {
  expo: {
    name: "AI Project Planner",
    slug: "ai-project-planner",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    platforms: ["ios", "android", "web"],
    
    // iOS configuration
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.aiprojectplanner.app",
      buildNumber: "1",
      infoPlist: {
        NSCameraUsageDescription: "This app uses camera to capture project ideas from images",
        NSCalendarsUsageDescription: "This app integrates with your calendar to schedule project tasks",
        NSRemindersUsageDescription: "This app can create reminders for your project deadlines"
      }
    },
    
    // Android configuration
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.aiprojectplanner.app",
      versionCode: 1,
      permissions: [
        "CAMERA",
        "READ_CALENDAR",
        "WRITE_CALENDAR",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE"
      ]
    },
    
    // Web configuration
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
      name: "AI Project Planner",
      shortName: "AI Planner",
      description: "Transform your ideas into comprehensive project plans with AI",
      startUrl: "/",
      display: "standalone",
      orientation: "any",
      themeColor: "#2383E2",
      backgroundColor: "#ffffff",
      preferRelatedApplications: false,
      meta: {
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "default",
        "apple-mobile-web-app-title": "AI Project Planner"
      }
    },
    
    // Plugin configuration for cross-platform features
    plugins: [
      "expo-secure-store",
      "expo-calendar",
      "expo-notifications",
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you capture project ideas from images."
        }
      ]
    ],
    
    // Updates configuration
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/[your-project-id]"
    },
    
    // Runtime version for updates
    runtimeVersion: {
      policy: "sdkVersion"
    },
    
    // Extra configuration for cross-platform compatibility
    extra: {
      eas: {
        projectId: "your-project-id-here"
      }
    },
    
    // Scheme for deep linking
    scheme: "aiprojectplanner"
  }
};
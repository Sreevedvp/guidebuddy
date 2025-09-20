import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { ProjectPlan, StorageConfig } from '../../types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../../constants';
import { isWeb } from '../../utils/platform';

class StorageService {
  // Secure storage for sensitive data (API keys, tokens)
  private async setSecureItem(key: string, value: string): Promise<void> {
    try {
      if (isWeb) {
        // For web, use localStorage with basic encryption (in production, use more robust encryption)
        const encrypted = btoa(value); // Basic base64 encoding - use proper encryption in production
        localStorage.setItem(key, encrypted);
      } else {
        // For mobile, use Expo SecureStore
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`Failed to set secure item ${key}:`, error);
      throw error;
    }
  }

  private async getSecureItem(key: string): Promise<string | null> {
    try {
      if (isWeb) {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;
        return atob(encrypted); // Basic base64 decoding
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error(`Failed to get secure item ${key}:`, error);
      return null;
    }
  }

  private async deleteSecureItem(key: string): Promise<void> {
    try {
      if (isWeb) {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`Failed to delete secure item ${key}:`, error);
      throw error;
    }
  }

  // Regular storage for app data
  private async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  }

  private async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) return defaultValue || null;
      return JSON.parse(jsonValue) as T;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return defaultValue || null;
    }
  }

  private async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw error;
    }
  }

  // API Key management
  public async saveApiKey(apiKey: string): Promise<void> {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error('API key cannot be empty');
    }
    await this.setSecureItem(STORAGE_KEYS.API_KEY, apiKey.trim());
  }

  public async getApiKey(): Promise<string | null> {
    return await this.getSecureItem(STORAGE_KEYS.API_KEY);
  }

  public async removeApiKey(): Promise<void> {
    await this.deleteSecureItem(STORAGE_KEYS.API_KEY);
  }

  public async hasApiKey(): Promise<boolean> {
    const apiKey = await this.getApiKey();
    return !!apiKey;
  }

  // User settings management
  public async saveSettings(settings: StorageConfig): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_SETTINGS, settings);
  }

  public async getSettings(): Promise<StorageConfig> {
    const settings = await this.getItem<StorageConfig>(STORAGE_KEYS.USER_SETTINGS);
    return settings || DEFAULT_SETTINGS;
  }

  public async updateSettings(partialSettings: Partial<StorageConfig>): Promise<void> {
    const currentSettings = await this.getSettings();
    const updatedSettings = { ...currentSettings, ...partialSettings };
    await this.saveSettings(updatedSettings);
  }

  // Project management
  public async saveProject(project: ProjectPlan): Promise<void> {
    const projects = await this.getAllProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = { ...project, updatedAt: new Date() };
    } else {
      projects.push(project);
    }
    
    await this.setItem(STORAGE_KEYS.PROJECTS, projects);
  }

  public async getProject(projectId: string): Promise<ProjectPlan | null> {
    const projects = await this.getAllProjects();
    return projects.find(p => p.id === projectId) || null;
  }

  public async getAllProjects(): Promise<ProjectPlan[]> {
    const projects = await this.getItem<ProjectPlan[]>(STORAGE_KEYS.PROJECTS, []);
    return projects || [];
  }

  public async deleteProject(projectId: string): Promise<void> {
    const projects = await this.getAllProjects();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    await this.setItem(STORAGE_KEYS.PROJECTS, filteredProjects);
  }

  public async getProjectsByStatus(status: ProjectPlan['status']): Promise<ProjectPlan[]> {
    const projects = await this.getAllProjects();
    return projects.filter(p => p.status === status);
  }

  // Theme management
  public async saveTheme(theme: 'light' | 'dark' | 'auto'): Promise<void> {
    await this.setItem(STORAGE_KEYS.THEME, theme);
  }

  public async getTheme(): Promise<'light' | 'dark' | 'auto'> {
    const theme = await this.getItem<'light' | 'dark' | 'auto'>(STORAGE_KEYS.THEME, 'light');
    return theme || 'light';
  }

  // Onboarding status
  public async setOnboardingCompleted(completed: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed);
  }

  public async isOnboardingCompleted(): Promise<boolean> {
    const completed = await this.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED, false);
    return completed || false;
  }

  // Sync timestamp management
  public async updateLastSync(): Promise<void> {
    await this.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }

  public async getLastSync(): Promise<Date | null> {
    const timestamp = await this.getItem<string>(STORAGE_KEYS.LAST_SYNC);
    return timestamp ? new Date(timestamp) : null;
  }

  // Utility methods
  public async clearAllData(): Promise<void> {
    try {
      // Clear regular storage
      await AsyncStorage.clear();
      
      // Clear secure storage
      if (!isWeb) {
        // On mobile, we need to manually delete known secure items
        await this.deleteSecureItem(STORAGE_KEYS.API_KEY);
      } else {
        // On web, clear localStorage
        localStorage.clear();
      }
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }

  public async exportData(): Promise<string> {
    try {
      const data = {
        projects: await this.getAllProjects(),
        settings: await this.getSettings(),
        theme: await this.getTheme(),
        onboardingCompleted: await this.isOnboardingCompleted(),
        lastSync: await this.getLastSync(),
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  public async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.version || !data.exportDate) {
        throw new Error('Invalid export data format');
      }

      // Import projects
      if (data.projects && Array.isArray(data.projects)) {
        await this.setItem(STORAGE_KEYS.PROJECTS, data.projects);
      }

      // Import settings
      if (data.settings) {
        await this.saveSettings(data.settings);
      }

      // Import theme
      if (data.theme) {
        await this.saveTheme(data.theme);
      }

      // Import onboarding status
      if (data.onboardingCompleted !== undefined) {
        await this.setOnboardingCompleted(data.onboardingCompleted);
      }

      console.log('Data imported successfully');
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }

  // Platform-specific storage info
  public async getStorageInfo(): Promise<{
    platform: string;
    hasSecureStorage: boolean;
    storageType: string;
  }> {
    return {
      platform: Platform.OS,
      hasSecureStorage: !isWeb,
      storageType: isWeb ? 'localStorage + AsyncStorage' : 'SecureStore + AsyncStorage',
    };
  }

  // Migration utilities for future versions
  public async migrateData(fromVersion: string, toVersion: string): Promise<void> {
    console.log(`Migrating data from ${fromVersion} to ${toVersion}`);
    
    // Add migration logic here when needed
    // For now, this is a placeholder for future version migrations
  }
}

export const storageService = new StorageService();
export default storageService;
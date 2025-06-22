import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  defaultPaperSize: 'a4' | 'letter';
  defaultOrientation: 'portrait' | 'landscape';
  showAnswersByDefault: boolean;
  autoSaveEnabled: boolean;
  preferredSubjects: string[];
  preferredGrades: number[];
  language: string;
  mathRenderingEngine: 'katex' | 'mathjax';
  exportQuality: 'standard' | 'high';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  customFooter?: string;
  recentWorksheets: string[];
  favorites: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly STORAGE_KEY = 'worksheet-app-settings';
  
  private defaultSettings: UserSettings = {
    theme: 'auto',
    defaultPaperSize: 'a4',
    defaultOrientation: 'portrait',
    showAnswersByDefault: false,
    autoSaveEnabled: true,
    preferredSubjects: ['mathematics'],
    preferredGrades: [7],
    language: 'en',
    mathRenderingEngine: 'katex',
    exportQuality: 'standard',
    margins: {
      top: 20,
      right: 15,
      bottom: 20,
      left: 15
    },
    customFooter: '© 2024-2025 Shakoor Hussain Attari | Educational Materials',
    recentWorksheets: [],
    favorites: []
  };

  private settingsSubject = new BehaviorSubject<UserSettings>(this.loadSettings());
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    // Apply theme on initialization
    this.applyTheme(this.settingsSubject.value.theme);
  }

  private loadSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...this.defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return this.defaultSettings;
  }

  private saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
      this.settingsSubject.next(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  getSettings(): Observable<UserSettings> {
    return this.settings$;
  }

  getCurrentSettings(): UserSettings {
    return this.settingsSubject.value;
  }

  updateSettings(updates: Partial<UserSettings>): void {
    const currentSettings = this.settingsSubject.value;
    const newSettings = { ...currentSettings, ...updates };
    
    // Apply theme if it changed
    if (updates.theme && updates.theme !== currentSettings.theme) {
      this.applyTheme(updates.theme);
    }
    
    this.saveSettings(newSettings);
  }

  resetSettings(): void {
    this.saveSettings(this.defaultSettings);
    this.applyTheme(this.defaultSettings.theme);
  }

  addToRecent(worksheetId: string): void {
    const settings = this.settingsSubject.value;
    const recent = [...settings.recentWorksheets];
    
    // Remove if already exists
    const index = recent.indexOf(worksheetId);
    if (index > -1) {
      recent.splice(index, 1);
    }
    
    // Add to beginning
    recent.unshift(worksheetId);
    
    // Keep only last 10
    if (recent.length > 10) {
      recent.splice(10);
    }
    
    this.updateSettings({ recentWorksheets: recent });
  }

  addToFavorites(worksheetId: string): void {
    const settings = this.settingsSubject.value;
    const favorites = [...settings.favorites];
    
    if (!favorites.includes(worksheetId)) {
      favorites.push(worksheetId);
      this.updateSettings({ favorites });
    }
  }

  removeFromFavorites(worksheetId: string): void {
    const settings = this.settingsSubject.value;
    const favorites = settings.favorites.filter(id => id !== worksheetId);
    this.updateSettings({ favorites });
  }

  isFavorite(worksheetId: string): boolean {
    return this.settingsSubject.value.favorites.includes(worksheetId);
  }

  private applyTheme(theme: 'light' | 'dark' | 'auto'): void {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'auto') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
    } else {
      body.classList.add(`${theme}-theme`);
    }
  }

  exportSettings(): string {
    return JSON.stringify(this.settingsSubject.value, null, 2);
  }

  importSettings(settingsJson: string): boolean {
    try {
      const settings = JSON.parse(settingsJson);
      
      // Validate settings structure
      if (this.validateSettings(settings)) {
        this.saveSettings({ ...this.defaultSettings, ...settings });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }

  private validateSettings(settings: any): boolean {
    // Basic validation - in a real app, you'd want more comprehensive validation
    return (
      typeof settings === 'object' &&
      settings !== null &&
      ['light', 'dark', 'auto'].includes(settings.theme)
    );
  }
}

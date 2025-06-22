import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { SettingsService, UserSettings } from '../../core/services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSnackBarModule
  ],
  template: `
    <div class="settings-container">
      <h1>Settings</h1>
      
      <form [formGroup]="settingsForm" (ngSubmit)="onSave()">
        <mat-card class="settings-section">
          <mat-card-header>
            <mat-card-title>Appearance</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Theme</mat-label>
                <mat-select formControlName="theme">
                  <mat-option value="light">Light</mat-option>
                  <mat-option value="dark">Dark</mat-option>
                  <mat-option value="auto">Auto (System)</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Language</mat-label>
                <mat-select formControlName="language">
                  <mat-option value="en">English</mat-option>
                  <mat-option value="es">Spanish (Coming Soon)</mat-option>
                  <mat-option value="fr">French (Coming Soon)</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-section">
          <mat-card-header>
            <mat-card-title>Export Settings</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Default Paper Size</mat-label>
                <mat-select formControlName="defaultPaperSize">
                  <mat-option value="a4">A4</mat-option>
                  <mat-option value="letter">Letter</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Default Orientation</mat-label>
                <mat-select formControlName="defaultOrientation">
                  <mat-option value="portrait">Portrait</mat-option>
                  <mat-option value="landscape">Landscape</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Export Quality</mat-label>
                <mat-select formControlName="exportQuality">
                  <mat-option value="standard">Standard</mat-option>
                  <mat-option value="high">High Quality</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Math Rendering</mat-label>
                <mat-select formControlName="mathRenderingEngine">
                  <mat-option value="katex">KaTeX (Recommended)</mat-option>
                  <mat-option value="mathjax">MathJax</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Custom Footer Text</mat-label>
              <input matInput formControlName="customFooter" 
                     placeholder="e.g., © 2024 Your Organization">
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-section">
          <mat-card-header>
            <mat-card-title>Worksheet Preferences</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="toggle-row">
              <mat-slide-toggle formControlName="showAnswersByDefault">
                Show answers by default
              </mat-slide-toggle>
            </div>

            <div class="toggle-row">
              <mat-slide-toggle formControlName="autoSaveEnabled">
                Auto-save settings
              </mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="actions">
          <button mat-raised-button color="primary" type="submit">
            <mat-icon>save</mat-icon>
            Save Settings
          </button>
          
          <button mat-button type="button" (click)="onReset()">
            <mat-icon>restore</mat-icon>
            Reset to Defaults
          </button>

          <button mat-button type="button" (click)="onExport()">
            <mat-icon>download</mat-icon>
            Export Settings
          </button>

          <button mat-button type="button" (click)="fileInput.click()">
            <mat-icon>upload</mat-icon>
            Import Settings
          </button>
        </div>
      </form>

      <input 
        #fileInput 
        type="file" 
        accept=".json" 
        style="display: none" 
        (change)="onImport($event)"
      >
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      margin: 0 0 24px 0;
      font-size: 2rem;
      font-weight: 300;
    }

    .settings-section {
      margin-bottom: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      width: 100%;
    }

    .toggle-row {
      margin: 16px 0;
    }

    .actions {
      display: flex;
      gap: 16px;
      margin-top: 32px;
      flex-wrap: wrap;
    }

    .actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 600px) {
      .settings-container {
        padding: 16px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;
      }

      .actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar
  ) {
    this.settingsForm = this.fb.group({
      theme: ['auto'],
      language: ['en'],
      defaultPaperSize: ['a4'],
      defaultOrientation: ['portrait'],
      exportQuality: ['standard'],
      mathRenderingEngine: ['katex'],
      customFooter: [''],
      showAnswersByDefault: [false],
      autoSaveEnabled: [true]
    });
  }

  ngOnInit(): void {
    // Load current settings
    this.settingsService.getSettings().subscribe(settings => {
      this.settingsForm.patchValue(settings);
    });
  }

  onSave(): void {
    if (this.settingsForm.valid) {
      const settings = this.settingsForm.value as Partial<UserSettings>;
      this.settingsService.updateSettings(settings);
      this.snackBar.open('Settings saved successfully', 'Close', { duration: 3000 });
    }
  }

  onReset(): void {
    this.settingsService.resetSettings();
    this.ngOnInit(); // Reload form with default settings
    this.snackBar.open('Settings reset to defaults', 'Close', { duration: 3000 });
  }

  onExport(): void {
    const settingsJson = this.settingsService.exportSettings();
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'worksheet-app-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.snackBar.open('Settings exported successfully', 'Close', { duration: 3000 });
  }

  onImport(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settingsJson = e.target?.result as string;
        const success = this.settingsService.importSettings(settingsJson);
        
        if (success) {
          this.ngOnInit(); // Reload form with imported settings
          this.snackBar.open('Settings imported successfully', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Invalid settings file', 'Close', { duration: 3000 });
        }
      } catch (error) {
        this.snackBar.open('Error importing settings', 'Close', { duration: 3000 });
      }
    };
    reader.readAsText(file);
  }
}

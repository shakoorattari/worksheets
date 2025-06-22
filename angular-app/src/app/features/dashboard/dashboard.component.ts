import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WorksheetService, WorksheetMetadata } from '../../core/services/worksheet.service';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Educational Worksheets Dashboard</h1>
        <p class="subtitle">Welcome back! Here's your learning overview.</p>
      </header>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>assignment</mat-icon>
            <mat-card-title>Total Worksheets</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ (totalWorksheets$ | async) || 0 }}</div>
            <div class="stat-label">Available worksheets</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>grade</mat-icon>
            <mat-card-title>Grade Levels</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">12</div>
            <div class="stat-label">Grades 1-12 covered</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>school</mat-icon>
            <mat-card-title>Subjects</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">1</div>
            <div class="stat-label">Mathematics (more coming)</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>favorite</mat-icon>
            <mat-card-title>Favorites</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ (favoriteCount$ | async) || 0 }}</div>
            <div class="stat-label">Saved worksheets</div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="sections-grid">
        <mat-card class="section-card">
          <mat-card-header>
            <mat-card-title>Recent Worksheets</mat-card-title>
            <mat-card-subtitle>Continue where you left off</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="worksheet-list" *ngIf="recentWorksheets$ | async as recent; else noRecent">
              <div 
                class="worksheet-item" 
                *ngFor="let worksheet of recent.slice(0, 5)"
                [routerLink]="['/worksheet', worksheet.id]"
              >
                <div class="worksheet-info">
                  <h4>{{ worksheet.title }}</h4>
                  <p>Grade {{ worksheet.grade }} • {{ worksheet.difficulty | titlecase }} • {{ worksheet.totalMarks }} marks</p>
                </div>
                <mat-chip-listbox>
                  <mat-chip>{{ worksheet.topic | titlecase }}</mat-chip>
                </mat-chip-listbox>
              </div>
            </div>
            <ng-template #noRecent>
              <p class="empty-state">No recent worksheets. Start exploring!</p>
            </ng-template>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/browse">View All Worksheets</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="section-card">
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
            <mat-card-subtitle>Jump right in</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="action-buttons">
              <button mat-raised-button color="primary" routerLink="/browse">
                <mat-icon>search</mat-icon>
                Browse Worksheets
              </button>
              <button mat-raised-button color="accent" routerLink="/subjects/mathematics">
                <mat-icon>calculate</mat-icon>
                Mathematics
              </button>
              <button mat-raised-button routerLink="/generator">
                <mat-icon>create</mat-icon>
                Worksheet Generator
              </button>
              <button mat-raised-button routerLink="/collections">
                <mat-icon>folder</mat-icon>
                My Collections
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="section-card">
          <mat-card-header>
            <mat-card-title>Popular Topics</mat-card-title>
            <mat-card-subtitle>Most accessed content</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="topic-chips">
              <mat-chip-listbox>
                <mat-chip routerLink="/browse" [queryParams]="{topic: 'decimals'}">Decimals</mat-chip>
                <mat-chip routerLink="/browse" [queryParams]="{topic: 'fractions'}">Fractions</mat-chip>
                <mat-chip routerLink="/browse" [queryParams]="{topic: 'algebra'}">Algebra</mat-chip>
                <mat-chip routerLink="/browse" [queryParams]="{topic: 'geometry'}">Geometry</mat-chip>
                <mat-chip routerLink="/browse" [queryParams]="{topic: 'statistics'}">Statistics</mat-chip>
              </mat-chip-listbox>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="section-card">
          <mat-card-header>
            <mat-card-title>Grade Focus</mat-card-title>
            <mat-card-subtitle>Select your target grade</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="grade-buttons">
              <button 
                mat-stroked-button 
                *ngFor="let grade of grades" 
                [routerLink]="['/browse']" 
                [queryParams]="{grade: grade}"
                class="grade-button"
              >
                Grade {{ grade }}
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 300;
      color: var(--primary-color, #1976d2);
    }

    .subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary, #666);
      margin: 8px 0 0 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      text-align: center;
    }

    .stat-card mat-card-header {
      justify-content: center;
      margin-bottom: 16px;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: var(--primary-color, #1976d2);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.9rem;
      color: var(--text-secondary, #666);
      margin-top: 4px;
    }

    .sections-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .section-card {
      height: fit-content;
    }

    .worksheet-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .worksheet-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .worksheet-item:hover {
      background-color: #f5f5f5;
    }

    .worksheet-info h4 {
      margin: 0 0 4px 0;
      font-size: 1rem;
      font-weight: 500;
    }

    .worksheet-info p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-secondary, #666);
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
    }

    .action-buttons button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
      height: auto;
    }

    .topic-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .topic-chips mat-chip {
      cursor: pointer;
    }

    .grade-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: 8px;
    }

    .grade-button {
      aspect-ratio: 1;
      font-weight: 500;
    }

    .empty-state {
      text-align: center;
      color: var(--text-secondary, #666);
      font-style: italic;
      margin: 24px 0;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .sections-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .action-buttons {
        grid-template-columns: repeat(2, 1fr);
      }

      .grade-buttons {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalWorksheets$: Observable<number>;
  recentWorksheets$: Observable<WorksheetMetadata[]>;
  favoriteCount$: Observable<number>;
  
  grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(
    private worksheetService: WorksheetService,
    private settingsService: SettingsService
  ) {
    this.totalWorksheets$ = this.worksheetService.getWorksheets().pipe(
      map(worksheets => worksheets.length)
    );

    this.favoriteCount$ = this.settingsService.getSettings().pipe(
      map(settings => settings.favorites.length)
    );

    this.recentWorksheets$ = this.settingsService.getSettings().pipe(
      map(settings => {
        const allWorksheets = this.worksheetService.getWorksheets();
        // This would need to be implemented properly with actual worksheet data
        return [];
      })
    );
  }

  ngOnInit(): void {
    // Component initialization logic
    this.loadDashboardData();
    // Initialize available worksheets
    this.worksheetService.getWorksheets();
  }

  private loadDashboardData(): void {
    // Dashboard data loading logic
    console.log('Dashboard loaded');
  }
}

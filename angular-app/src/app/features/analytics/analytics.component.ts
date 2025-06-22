import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorksheetService } from '../../core/services/worksheet.service';
import { SettingsService } from '../../core/services/settings.service';

interface AnalyticsData {
  totalWorksheets: number;
  completedWorksheets: number;
  averageScore: number;
  timeSpent: number;
  favoriteSubjects: { subject: string; count: number; }[];
  recentActivity: { 
    date: string; 
    action: string; 
    worksheet: string; 
    score?: number; 
  }[];
  weeklyProgress: { 
    week: string; 
    completed: number; 
    averageScore: number; 
  }[];
  subjectProgress: {
    subject: string;
    totalWorksheets: number;
    completed: number;
    averageScore: number;
    timeSpent: number;
  }[];
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="analytics-container">
      <!-- Header -->
      <div class="header">
        <h1>📊 Learning Analytics</h1>
        <p>Track your progress and identify areas for improvement</p>
      </div>

      <!-- Quick Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>{{ analyticsData.totalWorksheets }}</h3>
            <p>Total Worksheets</p>
          </div>
        </div>

        <div class="stat-card success">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ analyticsData.completedWorksheets }}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div class="stat-card warning">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <h3>{{ analyticsData.averageScore }}%</h3>
            <p>Average Score</p>
          </div>
        </div>

        <div class="stat-card info">
          <div class="stat-icon">⏱️</div>
          <div class="stat-content">
            <h3>{{ formatTime(analyticsData.timeSpent) }}</h3>
            <p>Time Spent</p>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <!-- Weekly Progress Chart -->
        <div class="chart-container">
          <h2>📈 Weekly Progress</h2>
          <div class="progress-chart">
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div 
                  *ngFor="let week of analyticsData.weeklyProgress" 
                  class="chart-bar"
                  [style.height.%]="(week.completed / 10) * 100"
                  [title]="week.week + ': ' + week.completed + ' completed, ' + week.averageScore + '% avg'"
                >
                  <span class="bar-label">{{ week.week }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Subject Progress -->
        <div class="chart-container">
          <h2>📖 Subject Progress</h2>
          <div class="subject-progress">
            <div 
              *ngFor="let subject of analyticsData.subjectProgress" 
              class="subject-item"
            >
              <div class="subject-header">
                <span class="subject-name">{{ subject.subject }}</span>
                <span class="subject-stats">{{ subject.completed }}/{{ subject.totalWorksheets }} ({{ subject.averageScore }}%)</span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  [style.width.%]="(subject.completed / subject.totalWorksheets) * 100"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="activity-section">
        <h2>🕒 Recent Activity</h2>
        <div class="activity-list">
          <div 
            *ngFor="let activity of analyticsData.recentActivity" 
            class="activity-item"
          >
            <div class="activity-icon">
              {{ getActivityIcon(activity.action) }}
            </div>
            <div class="activity-content">
              <p class="activity-text">
                <strong>{{ activity.action }}</strong> {{ activity.worksheet }}
                <span *ngIf="activity.score" class="activity-score">
                  ({{ activity.score }}%)
                </span>
              </p>
              <p class="activity-date">{{ activity.date }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Favorite Subjects -->
      <div class="favorites-section">
        <h2>⭐ Favorite Subjects</h2>
        <div class="favorites-grid">
          <div 
            *ngFor="let favorite of analyticsData.favoriteSubjects" 
            class="favorite-item"
          >
            <div class="favorite-icon">{{ getSubjectIcon(favorite.subject) }}</div>
            <div class="favorite-name">{{ favorite.subject }}</div>
            <div class="favorite-count">{{ favorite.count }} worksheets</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn primary" (click)="exportAnalytics()">
          📊 Export Report
        </button>
        <button class="btn secondary" routerLink="/browse">
          📚 Browse Worksheets
        </button>
        <button class="btn secondary" routerLink="/dashboard">
          🏠 Back to Dashboard
        </button>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .header p {
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-card.primary { border-left: 4px solid #3498db; }
    .stat-card.success { border-left: 4px solid #2ecc71; }
    .stat-card.warning { border-left: 4px solid #f39c12; }
    .stat-card.info { border-left: 4px solid #9b59b6; }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-content h3 {
      font-size: 2rem;
      font-weight: bold;
      margin: 0;
      color: #2c3e50;
    }

    .stat-content p {
      margin: 0;
      color: #7f8c8d;
      font-weight: 500;
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .chart-container {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .chart-container h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }

    .progress-chart {
      height: 200px;
      position: relative;
    }

    .chart-bars {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 100%;
      gap: 0.5rem;
    }

    .chart-bar {
      background: linear-gradient(to top, #3498db, #5dade2);
      min-height: 20px;
      border-radius: 4px 4px 0 0;
      position: relative;
      flex: 1;
      max-width: 40px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .chart-bar:hover {
      background: linear-gradient(to top, #2980b9, #3498db);
    }

    .bar-label {
      position: absolute;
      bottom: -25px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.8rem;
      color: #7f8c8d;
    }

    .subject-progress {
      space-y: 1rem;
    }

    .subject-item {
      margin-bottom: 1rem;
    }

    .subject-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .subject-name {
      font-weight: 600;
      color: #2c3e50;
    }

    .subject-stats {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #ecf0f1;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(to right, #3498db, #2ecc71);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .activity-section,
    .favorites-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .activity-section h2,
    .favorites-section h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 1.3rem;
    }

    .activity-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #ecf0f1;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      font-size: 1.5rem;
      width: 40px;
      text-align: center;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      margin: 0;
      color: #2c3e50;
    }

    .activity-score {
      color: #27ae60;
      font-weight: 600;
    }

    .activity-date {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }

    .favorite-item {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      transition: background 0.2s ease;
    }

    .favorite-item:hover {
      background: #e9ecef;
    }

    .favorite-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .favorite-name {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.25rem;
    }

    .favorite-count {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn.primary {
      background: #3498db;
      color: white;
    }

    .btn.primary:hover {
      background: #2980b9;
    }

    .btn.secondary {
      background: #95a5a6;
      color: white;
    }

    .btn.secondary:hover {
      background: #7f8c8d;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .analytics-container {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .charts-section {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  analyticsData: AnalyticsData = {
    totalWorksheets: 0,
    completedWorksheets: 0,
    averageScore: 0,
    timeSpent: 0,
    favoriteSubjects: [],
    recentActivity: [],
    weeklyProgress: [],
    subjectProgress: []
  };

  constructor(
    private worksheetService: WorksheetService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  private loadAnalyticsData(): void {
    // Load analytics data from services
    // This would integrate with real user data in production
    this.analyticsData = {
      totalWorksheets: 45,
      completedWorksheets: 32,
      averageScore: 87,
      timeSpent: 14400, // seconds
      favoriteSubjects: [
        { subject: 'Mathematics', count: 15 },
        { subject: 'Science', count: 12 },
        { subject: 'English', count: 8 },
        { subject: 'History', count: 5 }
      ],
      recentActivity: [
        { 
          date: '2024-01-15', 
          action: 'Completed', 
          worksheet: 'Grade 7 Algebra - Linear Equations', 
          score: 92 
        },
        { 
          date: '2024-01-14', 
          action: 'Started', 
          worksheet: 'Grade 7 Geometry - Angles' 
        },
        { 
          date: '2024-01-13', 
          action: 'Completed', 
          worksheet: 'Grade 7 Fractions - Mixed Numbers', 
          score: 85 
        },
        { 
          date: '2024-01-12', 
          action: 'Favorited', 
          worksheet: 'Grade 7 Statistics - Mean and Median' 
        },
        { 
          date: '2024-01-11', 
          action: 'Completed', 
          worksheet: 'Grade 7 Decimals - Operations', 
          score: 94 
        }
      ],
      weeklyProgress: [
        { week: 'W1', completed: 5, averageScore: 88 },
        { week: 'W2', completed: 7, averageScore: 85 },
        { week: 'W3', completed: 6, averageScore: 90 },
        { week: 'W4', completed: 8, averageScore: 87 },
        { week: 'W5', completed: 6, averageScore: 89 }
      ],
      subjectProgress: [
        { 
          subject: 'Mathematics', 
          totalWorksheets: 20, 
          completed: 15, 
          averageScore: 88, 
          timeSpent: 7200 
        },
        { 
          subject: 'Science', 
          totalWorksheets: 15, 
          completed: 12, 
          averageScore: 85, 
          timeSpent: 4800 
        },
        { 
          subject: 'English', 
          totalWorksheets: 10, 
          completed: 5, 
          averageScore: 90, 
          timeSpent: 2400 
        }
      ]
    };
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  getActivityIcon(action: string): string {
    const icons: { [key: string]: string } = {
      'Completed': '✅',
      'Started': '▶️',
      'Favorited': '⭐',
      'Downloaded': '⬇️',
      'Shared': '📤'
    };
    return icons[action] || '📄';
  }

  getSubjectIcon(subject: string): string {
    const icons: { [key: string]: string } = {
      'Mathematics': '🔢',
      'Science': '🔬',
      'English': '📝',
      'History': '🏛️',
      'Geography': '🌍',
      'Art': '🎨',
      'Music': '🎵',
      'Physical Education': '⚽'
    };
    return icons[subject] || '📚';
  }

  exportAnalytics(): void {
    // Create analytics report
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalWorksheets: this.analyticsData.totalWorksheets,
        completedWorksheets: this.analyticsData.completedWorksheets,
        completionRate: Math.round((this.analyticsData.completedWorksheets / this.analyticsData.totalWorksheets) * 100),
        averageScore: this.analyticsData.averageScore,
        timeSpent: this.formatTime(this.analyticsData.timeSpent)
      },
      detailedData: this.analyticsData
    };

    // Export as JSON
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `learning-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);

    // Show success message
    alert('📊 Analytics report exported successfully!');
  }
}

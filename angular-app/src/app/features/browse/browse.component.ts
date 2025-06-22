import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Observable, combineLatest, startWith, map, debounceTime } from 'rxjs';

import { WorksheetService, WorksheetMetadata } from '../../core/services/worksheet.service';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatToolbarModule,
    MatPaginatorModule
  ],
  template: `
    <div class="browse-container">
      <mat-toolbar class="search-toolbar">
        <h2>Browse Worksheets</h2>
        <span class="spacer"></span>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search worksheets...</mat-label>
          <input matInput [formControl]="searchControl" placeholder="Enter topic, grade, or keyword">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </mat-toolbar>

      <div class="filters-section">
        <div class="filter-row">
          <mat-form-field appearance="outline">
            <mat-label>Subject</mat-label>
            <mat-select [formControl]="subjectControl">
              <mat-option value="">All Subjects</mat-option>
              <mat-option value="mathematics">Mathematics</mat-option>
              <mat-option value="science">Science (Coming Soon)</mat-option>
              <mat-option value="english">English (Coming Soon)</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Grade</mat-label>
            <mat-select [formControl]="gradeControl">
              <mat-option value="">All Grades</mat-option>
              <mat-option *ngFor="let grade of grades" [value]="grade">
                Grade {{ grade }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Difficulty</mat-label>
            <mat-select [formControl]="difficultyControl">
              <mat-option value="">All Difficulties</mat-option>
              <mat-option value="easy">Easy</mat-option>
              <mat-option value="medium">Medium</mat-option>
              <mat-option value="hard">Hard</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Topic</mat-label>
            <mat-select [formControl]="topicControl">
              <mat-option value="">All Topics</mat-option>
              <mat-option *ngFor="let topic of topics" [value]="topic">
                {{ topic | titlecase }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" (click)="clearFilters()">
            <mat-icon>clear</mat-icon>
            Clear Filters
          </button>
        </div>
      </div>

      <div class="results-section">
        <div class="results-header">
          <h3>{{ (filteredWorksheets$ | async)?.length || 0 }} worksheets found</h3>
          <div class="view-options">
            <button mat-icon-button [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'">
              <mat-icon>grid_view</mat-icon>
            </button>
            <button mat-icon-button [class.active]="viewMode === 'list'" (click)="viewMode = 'list'">
              <mat-icon>view_list</mat-icon>
            </button>
          </div>
        </div>

        <div class="worksheets-container" [class.list-view]="viewMode === 'list'">
          <mat-card 
            *ngFor="let worksheet of filteredWorksheets$ | async" 
            class="worksheet-card"
            [routerLink]="['/worksheet', worksheet.id]"
          >
            <mat-card-header>
              <div class="worksheet-meta">
                <mat-chip-listbox class="chip-list">
                  <mat-chip color="primary">Grade {{ worksheet.grade }}</mat-chip>
                  <mat-chip [color]="getDifficultyColor(worksheet.difficulty)">
                    {{ worksheet.difficulty | titlecase }}
                  </mat-chip>
                </mat-chip-listbox>
                <button 
                  mat-icon-button 
                  [color]="isFavorite(worksheet.id) ? 'warn' : ''"
                  (click)="toggleFavorite($event, worksheet.id)"
                  class="favorite-button"
                >
                  <mat-icon>{{ isFavorite(worksheet.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
                </button>
              </div>
            </mat-card-header>

            <mat-card-content>
              <h3 class="worksheet-title">{{ worksheet.title }}</h3>
              <p class="worksheet-description">
                {{ worksheet.subject | titlecase }} • {{ worksheet.topic | titlecase }}
              </p>
              
              <div class="worksheet-details">
                <div class="detail-item">
                  <mat-icon>schedule</mat-icon>
                  <span>{{ worksheet.estimatedTime }} min</span>
                </div>
                <div class="detail-item">
                  <mat-icon>assignment</mat-icon>
                  <span>{{ worksheet.totalMarks }} marks</span>
                </div>
                <div class="detail-item" *ngIf="worksheet.curriculum">
                  <mat-icon>school</mat-icon>
                  <span>{{ worksheet.curriculum }}</span>
                </div>
              </div>

              <div class="learning-objectives" *ngIf="worksheet.learningObjectives?.length">
                <h4>Learning Objectives:</h4>
                <ul>
                  <li *ngFor="let objective of worksheet.learningObjectives.slice(0, 3)">
                    {{ objective }}
                  </li>
                  <li *ngIf="worksheet.learningObjectives.length > 3" class="more-objectives">
                    ... and {{ worksheet.learningObjectives.length - 3 }} more
                  </li>
                </ul>
              </div>
            </mat-card-content>

            <mat-card-actions>
              <button mat-button color="primary">
                <mat-icon>visibility</mat-icon>
                View Worksheet
              </button>
              <button mat-button>
                <mat-icon>download</mat-icon>
                Export PDF
              </button>
            </mat-card-actions>
          </mat-card>
        </div>

        <div *ngIf="(filteredWorksheets$ | async)?.length === 0" class="empty-state">
          <mat-icon class="empty-icon">search_off</mat-icon>
          <h3>No worksheets found</h3>
          <p>Try adjusting your search criteria or filters.</p>
          <button mat-raised-button color="primary" (click)="clearFilters()">
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .browse-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .search-toolbar {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 24px;
      border-radius: 8px;
      padding: 16px 24px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .search-field {
      min-width: 300px;
    }

    .filters-section {
      margin-bottom: 24px;
    }

    .filter-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-row mat-form-field {
      min-width: 150px;
    }

    .results-section {
      min-height: 400px;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .results-header h3 {
      margin: 0;
      color: #666;
    }

    .view-options {
      display: flex;
      gap: 8px;
    }

    .view-options button.active {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .worksheets-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .worksheets-container.list-view {
      grid-template-columns: 1fr;
    }

    .worksheet-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
    }

    .worksheet-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .worksheet-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
    }

    .chip-list {
      display: flex;
      gap: 8px;
    }

    .favorite-button {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .worksheet-title {
      margin: 0 0 8px 0;
      font-size: 1.2rem;
      font-weight: 500;
      line-height: 1.3;
    }

    .worksheet-description {
      margin: 0 0 16px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .worksheet-details {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85rem;
      color: #666;
    }

    .detail-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .learning-objectives {
      margin-top: 16px;
    }

    .learning-objectives h4 {
      margin: 0 0 8px 0;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .learning-objectives ul {
      margin: 0;
      padding-left: 16px;
      font-size: 0.85rem;
      color: #666;
    }

    .learning-objectives li {
      margin-bottom: 4px;
    }

    .more-objectives {
      font-style: italic;
      color: #999;
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      color: #666;
    }

    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #ccc;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
    }

    .empty-state p {
      margin: 0 0 24px 0;
    }

    @media (max-width: 768px) {
      .browse-container {
        padding: 16px;
      }

      .search-toolbar {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .search-field {
        min-width: unset;
        width: 100%;
      }

      .filter-row {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-row mat-form-field {
        min-width: unset;
      }

      .worksheets-container {
        grid-template-columns: 1fr;
      }

      .results-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
    }
  `]
})
export class BrowseComponent implements OnInit {
  searchControl = new FormControl('');
  subjectControl = new FormControl('');
  gradeControl = new FormControl('');
  difficultyControl = new FormControl('');
  topicControl = new FormControl('');

  viewMode: 'grid' | 'list' = 'grid';
  
  grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  topics = ['decimals', 'fractions', 'algebra', 'geometry', 'statistics', 'probability', 'integers'];

  allWorksheets$: Observable<WorksheetMetadata[]>;
  filteredWorksheets$: Observable<WorksheetMetadata[]>;
  favorites: string[] = [];

  constructor(
    private worksheetService: WorksheetService,
    private settingsService: SettingsService,
    private route: ActivatedRoute
  ) {
    this.allWorksheets$ = this.worksheetService.getWorksheets();
    
    // Set up filtered worksheets based on all controls
    this.filteredWorksheets$ = combineLatest([
      this.allWorksheets$,
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300)),
      this.subjectControl.valueChanges.pipe(startWith('')),
      this.gradeControl.valueChanges.pipe(startWith('')),
      this.difficultyControl.valueChanges.pipe(startWith('')),
      this.topicControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([worksheets, search, subject, grade, difficulty, topic]) => {
        return worksheets.filter(worksheet => {
          const matchesSearch = !search || 
            worksheet.title.toLowerCase().includes(search.toLowerCase()) ||
            worksheet.topic.toLowerCase().includes(search.toLowerCase()) ||
            worksheet.subject.toLowerCase().includes(search.toLowerCase());

          const matchesSubject = !subject || worksheet.subject === subject;
          const matchesGrade = !grade || worksheet.grade === parseInt(grade);
          const matchesDifficulty = !difficulty || worksheet.difficulty === difficulty;
          const matchesTopic = !topic || worksheet.topic === topic;

          return matchesSearch && matchesSubject && matchesGrade && matchesDifficulty && matchesTopic;
        });
      })
    );
  }

  ngOnInit(): void {
    // Initialize available worksheets
    this.worksheetService.getWorksheets();
    
    // Handle query parameters from URL
    this.route.queryParams.subscribe(params => {
      if (params['subject']) this.subjectControl.setValue(params['subject']);
      if (params['grade']) this.gradeControl.setValue(params['grade']);
      if (params['difficulty']) this.difficultyControl.setValue(params['difficulty']);
      if (params['topic']) this.topicControl.setValue(params['topic']);
      if (params['search']) this.searchControl.setValue(params['search']);
    });

    // Load user favorites
    this.settingsService.getSettings().subscribe(settings => {
      this.favorites = settings.favorites;
    });
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.subjectControl.setValue('');
    this.gradeControl.setValue('');
    this.difficultyControl.setValue('');
    this.topicControl.setValue('');
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'primary';
      case 'medium': return 'accent';
      case 'hard': return 'warn';
      default: return '';
    }
  }

  isFavorite(worksheetId: string): boolean {
    return this.favorites.includes(worksheetId);
  }

  toggleFavorite(event: Event, worksheetId: string): void {
    event.stopPropagation();
    event.preventDefault();
    
    if (this.isFavorite(worksheetId)) {
      this.settingsService.removeFromFavorites(worksheetId);
    } else {
      this.settingsService.addToFavorites(worksheetId);
    }
  }
}

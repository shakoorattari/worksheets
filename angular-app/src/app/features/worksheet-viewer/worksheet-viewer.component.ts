import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, Subject, takeUntil } from 'rxjs';

import { WorksheetService, WorksheetContent, ExportOptions } from '../../core/services/worksheet.service';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-worksheet-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDialogModule
  ],
  template: `
    <div class="viewer-container" *ngIf="worksheet; else loading">
      <mat-toolbar class="worksheet-toolbar">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        
        <div class="worksheet-header-info">
          <h2>{{ worksheet.metadata.title }}</h2>
          <span class="worksheet-meta">
            Grade {{ worksheet.metadata.grade }} • 
            {{ worksheet.metadata.difficulty | titlecase }} • 
            {{ worksheet.metadata.totalMarks }} marks •
            {{ worksheet.metadata.estimatedTime }} min
          </span>
        </div>

        <span class="spacer"></span>

        <mat-slide-toggle 
          [(ngModel)]="showAnswers"
          (change)="onToggleAnswers()"
          color="accent"
        >
          Show Answers
        </mat-slide-toggle>

        <button mat-icon-button [matMenuTriggerFor]="exportMenu">
          <mat-icon>download</mat-icon>
        </button>

        <mat-menu #exportMenu="matMenu">
          <button mat-menu-item (click)="exportAs('pdf', false)">
            <mat-icon>picture_as_pdf</mat-icon>
            <span>Export as PDF</span>
          </button>
          <button mat-menu-item (click)="exportAs('pdf', true)">
            <mat-icon>picture_as_pdf</mat-icon>
            <span>Export PDF with Answers</span>
          </button>
          <button mat-menu-item (click)="exportAs('html', false)">
            <mat-icon>code</mat-icon>
            <span>Export as HTML</span>
          </button>
          <button mat-menu-item (click)="print()">
            <mat-icon>print</mat-icon>
            <span>Print</span>
          </button>
        </mat-menu>

        <button 
          mat-icon-button 
          [color]="isFavorite ? 'warn' : ''"
          (click)="toggleFavorite()"
        >
          <mat-icon>{{ isFavorite ? 'favorite' : 'favorite_border' }}</mat-icon>
        </button>
      </mat-toolbar>

      <mat-progress-bar *ngIf="isExporting" mode="indeterminate"></mat-progress-bar>

      <div class="worksheet-content">
        <mat-card class="content-card">
          <mat-card-content>
            <div 
              class="worksheet-html" 
              [innerHTML]="currentContent"
              #worksheetContent
            ></div>
          </mat-card-content>
        </mat-card>

        <div class="worksheet-actions">
          <button mat-raised-button color="primary" (click)="exportAs('pdf', false)">
            <mat-icon>download</mat-icon>
            Download PDF
          </button>
          
          <button mat-raised-button (click)="print()">
            <mat-icon>print</mat-icon>
            Print Worksheet
          </button>

          <button mat-button (click)="showMetadata = !showMetadata">
            <mat-icon>info</mat-icon>
            {{ showMetadata ? 'Hide' : 'Show' }} Details
          </button>
        </div>

        <mat-card class="metadata-card" *ngIf="showMetadata">
          <mat-card-header>
            <mat-card-title>Worksheet Details</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metadata-grid">
              <div class="metadata-item">
                <strong>Subject:</strong>
                <span>{{ worksheet.metadata.subject | titlecase }}</span>
              </div>
              <div class="metadata-item">
                <strong>Topic:</strong>
                <span>{{ worksheet.metadata.topic | titlecase }}</span>
              </div>
              <div class="metadata-item">
                <strong>Grade Level:</strong>
                <span>{{ worksheet.metadata.grade }}</span>
              </div>
              <div class="metadata-item">
                <strong>Difficulty:</strong>
                <span>{{ worksheet.metadata.difficulty | titlecase }}</span>
              </div>
              <div class="metadata-item">
                <strong>Total Marks:</strong>
                <span>{{ worksheet.metadata.totalMarks }}</span>
              </div>
              <div class="metadata-item">
                <strong>Estimated Time:</strong>
                <span>{{ worksheet.metadata.estimatedTime }} minutes</span>
              </div>
              <div class="metadata-item" *ngIf="worksheet.metadata.curriculum">
                <strong>Curriculum:</strong>
                <span>{{ worksheet.metadata.curriculum }}</span>
              </div>
            </div>

            <div class="learning-objectives" *ngIf="worksheet.metadata.learningObjectives?.length">
              <h4>Learning Objectives:</h4>
              <ul>
                <li *ngFor="let objective of worksheet.metadata.learningObjectives">
                  {{ objective }}
                </li>
              </ul>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        <p>Loading worksheet...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .viewer-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .worksheet-toolbar {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 10;
    }

    .worksheet-header-info {
      display: flex;
      flex-direction: column;
      margin-left: 16px;
    }

    .worksheet-header-info h2 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 500;
    }

    .worksheet-meta {
      font-size: 0.85rem;
      color: #666;
      margin-top: 4px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .worksheet-content {
      padding: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .content-card {
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .worksheet-html {
      font-family: 'Times New Roman', serif;
      line-height: 1.6;
      color: #000;
    }

    .worksheet-html h1 {
      text-align: center;
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
      color: #1976d2;
    }

    .worksheet-html h2 {
      font-size: 1.4rem;
      border-bottom: 2px solid #1976d2;
      padding-bottom: 0.3rem;
      margin: 1.5rem 0 1rem 0;
    }

    .worksheet-html h3 {
      font-size: 1.2rem;
      margin: 1.2rem 0 0.8rem 0;
    }

    .worksheet-html p {
      margin: 0.8rem 0;
    }

    .worksheet-html ul, .worksheet-html ol {
      margin: 0.8rem 0;
      padding-left: 2rem;
    }

    .worksheet-html li {
      margin: 0.4rem 0;
    }

    .worksheet-html hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 2rem 0;
    }

    .worksheet-html table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }

    .worksheet-html th,
    .worksheet-html td {
      border: 1px solid #ddd;
      padding: 0.75rem;
      text-align: left;
    }

    .worksheet-html th {
      background-color: #f5f5f5;
      font-weight: bold;
    }

    .worksheet-html .answer-key {
      background-color: #e8f5e8;
      border-left: 4px solid #4caf50;
      padding: 1rem;
      margin: 1rem 0;
    }

    .worksheet-html .answer-key h3 {
      color: #2e7d32;
      margin-top: 0;
    }

    .worksheet-actions {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .metadata-card {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .metadata-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .metadata-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metadata-item strong {
      color: #1976d2;
      font-size: 0.9rem;
    }

    .learning-objectives {
      border-top: 1px solid #eee;
      padding-top: 16px;
    }

    .learning-objectives h4 {
      margin: 0 0 12px 0;
      color: #1976d2;
    }

    .learning-objectives ul {
      margin: 0;
      padding-left: 20px;
    }

    .learning-objectives li {
      margin-bottom: 8px;
      line-height: 1.5;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      gap: 24px;
    }

    .loading-container p {
      color: #666;
      font-size: 1.1rem;
    }

    @media print {
      .worksheet-toolbar,
      .worksheet-actions,
      .metadata-card {
        display: none !important;
      }

      .viewer-container {
        background: white;
      }

      .content-card {
        box-shadow: none;
        margin: 0;
      }

      .worksheet-content {
        padding: 0;
        max-width: none;
      }

      .worksheet-html {
        font-size: 12pt;
      }
    }

    @media (max-width: 768px) {
      .worksheet-toolbar {
        padding: 8px 16px;
      }

      .worksheet-header-info h2 {
        font-size: 1.1rem;
      }

      .worksheet-meta {
        font-size: 0.8rem;
      }

      .worksheet-content {
        padding: 16px;
      }

      .worksheet-actions {
        flex-direction: column;
      }

      .worksheet-actions button {
        width: 100%;
      }

      .metadata-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WorksheetViewerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  worksheet: WorksheetContent | null = null;
  showAnswers = false;
  showMetadata = false;
  isFavorite = false;
  isExporting = false;

  currentContent: SafeHtml = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private worksheetService: WorksheetService,
    private settingsService: SettingsService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadWorksheet(id);
      }
    });

    // Load user settings for default answer visibility
    this.settingsService.getSettings().pipe(takeUntil(this.destroy$)).subscribe(settings => {
      this.showAnswers = settings.showAnswersByDefault;
      this.updateContent();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadWorksheet(id: string): Promise<void> {
    try {
      this.worksheet = await this.worksheetService.loadWorksheet(id);
      
      if (this.worksheet) {
        // Add to recent worksheets
        this.settingsService.addToRecent(id);
        
        // Check if it's a favorite
        this.settingsService.getSettings().pipe(takeUntil(this.destroy$)).subscribe(settings => {
          this.isFavorite = settings.favorites.includes(id);
        });

        this.updateContent();
      } else {
        this.snackBar.open('Worksheet not found', 'Close', { duration: 3000 });
        this.router.navigate(['/browse']);
      }
    } catch (error) {
      console.error('Error loading worksheet:', error);
      this.snackBar.open('Error loading worksheet', 'Close', { duration: 3000 });
    }
  }

  private updateContent(): void {
    if (!this.worksheet) return;

    let content = this.worksheet.htmlContent || '';
    
    if (this.showAnswers && this.worksheet.answerKeyHtml) {
      content += '<div class="answer-key">' + this.worksheet.answerKeyHtml + '</div>';
    }

    this.currentContent = this.sanitizer.bypassSecurityTrustHtml(content);
  }

  onToggleAnswers(): void {
    this.updateContent();
  }

  goBack(): void {
    window.history.back();
  }

  toggleFavorite(): void {
    if (!this.worksheet) return;

    if (this.isFavorite) {
      this.settingsService.removeFromFavorites(this.worksheet.metadata.id);
      this.snackBar.open('Removed from favorites', 'Close', { duration: 2000 });
    } else {
      this.settingsService.addToFavorites(this.worksheet.metadata.id);
      this.snackBar.open('Added to favorites', 'Close', { duration: 2000 });
    }
    
    this.isFavorite = !this.isFavorite;
  }

  async exportAs(format: 'pdf' | 'html', includeAnswers: boolean): Promise<void> {
    if (!this.worksheet) return;

    this.isExporting = true;

    try {
      const settings = this.settingsService.getCurrentSettings();
      const exportOptions: ExportOptions = {
        format,
        includeAnswers,
        paperSize: settings.defaultPaperSize,
        orientation: settings.defaultOrientation,
        margins: settings.margins,
        headerText: `${this.worksheet.metadata.title} - Grade ${this.worksheet.metadata.grade} Mathematics`,
        footerText: settings.customFooter
      };

      if (format === 'pdf') {
        const blob = await this.worksheetService.exportToPdf(this.worksheet, exportOptions);
        this.downloadBlob(blob, `${this.worksheet.metadata.id}.pdf`);
      } else {
        const html = this.worksheetService.exportToHtml(this.worksheet, exportOptions);
        const blob = new Blob([html], { type: 'text/html' });
        this.downloadBlob(blob, `${this.worksheet.metadata.id}.html`);
      }

      this.snackBar.open(`${format.toUpperCase()} exported successfully`, 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Export error:', error);
      this.snackBar.open('Export failed. Please try again.', 'Close', { duration: 3000 });
    } finally {
      this.isExporting = false;
    }
  }

  print(): void {
    window.print();
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

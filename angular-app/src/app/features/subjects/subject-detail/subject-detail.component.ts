import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WorksheetService } from '../../../core/services/worksheet.service';

interface SubjectWorksheet {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  estimatedTime: number;
  totalMarks: number;
  lastModified: string;
}

@Component({
  selector: 'app-subject-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="subject-detail-container">
      <!-- Header -->
      <div class="header">
        <div class="breadcrumb">
          <a routerLink="/subjects">📚 Subjects</a>
          <span class="breadcrumb-separator">›</span>
          <span class="current-page">{{ subjectName }} - Grade {{ grade }}</span>
        </div>
        <h1>{{ getSubjectIcon(subjectName) }} {{ subjectName }} Worksheets</h1>
        <p class="subtitle">Grade {{ grade }} • {{ worksheets.length }} worksheets available</p>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <h3>Filter Worksheets</h3>
        <div class="filters">
          <div class="filter-group">
            <label for="difficulty">Difficulty:</label>
            <select id="difficulty" [(ngModel)]="selectedDifficulty" (change)="applyFilters()">
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="topic">Topic:</label>
            <select id="topic" [(ngModel)]="selectedTopic" (change)="applyFilters()">
              <option value="">All Topics</option>
              <option *ngFor="let topic of availableTopics" [value]="topic">
                {{ topic }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="search">Search:</label>
            <input 
              type="text" 
              id="search" 
              placeholder="Search worksheets..."
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"
            >
          </div>
        </div>
      </div>

      <!-- Worksheets Grid -->
      <div class="worksheets-section">
        <div class="worksheets-header">
          <h3>Available Worksheets ({{ filteredWorksheets.length }})</h3>
          <div class="view-options">
            <button 
              class="view-btn" 
              [class.active]="viewMode === 'grid'"
              (click)="viewMode = 'grid'"
            >
              📱 Grid
            </button>
            <button 
              class="view-btn" 
              [class.active]="viewMode === 'list'"
              (click)="viewMode = 'list'"
            >
              📋 List
            </button>
          </div>
        </div>

        <div class="worksheets-container" [class]="viewMode + '-view'">
          <div 
            *ngFor="let worksheet of filteredWorksheets" 
            class="worksheet-card"
            (click)="openWorksheet(worksheet.id)"
          >
            <div class="worksheet-header">
              <h4>{{ worksheet.title }}</h4>
              <div class="difficulty-badge" [class]="'difficulty-' + worksheet.difficulty">
                {{ worksheet.difficulty.toUpperCase() }}
              </div>
            </div>
            
            <p class="worksheet-description">{{ worksheet.description }}</p>
            
            <div class="worksheet-details">
              <div class="detail-item">
                <span class="detail-icon">🏷️</span>
                <span class="detail-text">{{ worksheet.topics.join(', ') }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">⏱️</span>
                <span class="detail-text">{{ worksheet.estimatedTime }} min</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">📊</span>
                <span class="detail-text">{{ worksheet.totalMarks }} marks</span>
              </div>
            </div>

            <div class="worksheet-actions">
              <button class="btn-action primary" (click)="openWorksheet(worksheet.id); $event.stopPropagation()">
                👁️ View
              </button>
              <button class="btn-action secondary" (click)="downloadWorksheet(worksheet.id); $event.stopPropagation()">
                📥 Download
              </button>
              <button class="btn-action tertiary" (click)="toggleFavorite(worksheet.id); $event.stopPropagation()">
                {{ isFavorite(worksheet.id) ? '❤️' : '🤍' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredWorksheets.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>No worksheets found</h3>
          <p>Try adjusting your filters or search terms.</p>
          <button class="btn-action primary" (click)="clearFilters()">
            🔄 Clear Filters
          </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button class="btn-action primary" routerLink="/generator">
          ✨ Create Custom Worksheet
        </button>
        <button class="btn-action secondary" routerLink="/browse">
          🔍 Browse All Subjects
        </button>
        <button class="btn-action tertiary" routerLink="/subjects">
          ← Back to Subjects
        </button>
      </div>
    </div>
  `,
  styles: [`
    .subject-detail-container {
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

    .breadcrumb {
      margin-bottom: 1rem;
      color: #666;
    }

    .breadcrumb a {
      color: #3498db;
      text-decoration: none;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .breadcrumb-separator {
      margin: 0 0.5rem;
    }

    .current-page {
      font-weight: 600;
    }

    .header h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #7f8c8d;
      font-size: 1.1rem;
    }

    .filters-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .filters-section h3 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }

    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 600;
      color: #2c3e50;
    }

    .filter-group select,
    .filter-group input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
    }

    .worksheets-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .worksheets-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .worksheets-header h3 {
      color: #2c3e50;
      margin: 0;
    }

    .view-options {
      display: flex;
      gap: 0.5rem;
    }

    .view-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .view-btn:hover,
    .view-btn.active {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }

    .worksheets-container.grid-view {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .worksheets-container.list-view {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .worksheet-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid #e9ecef;
    }

    .worksheet-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .worksheet-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .worksheet-header h4 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.2rem;
      flex: 1;
    }

    .difficulty-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-left: 1rem;
    }

    .difficulty-easy {
      background: #d4edda;
      color: #155724;
    }

    .difficulty-medium {
      background: #fff3cd;
      color: #856404;
    }

    .difficulty-hard {
      background: #f8d7da;
      color: #721c24;
    }

    .worksheet-description {
      color: #666;
      line-height: 1.5;
      margin-bottom: 1rem;
    }

    .worksheet-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #666;
    }

    .detail-icon {
      font-size: 1rem;
    }

    .worksheet-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn-action {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
      flex: 1;
      min-width: 80px;
    }

    .btn-action.primary {
      background: #3498db;
      color: white;
    }

    .btn-action.primary:hover {
      background: #2980b9;
    }

    .btn-action.secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-action.secondary:hover {
      background: #7f8c8d;
    }

    .btn-action.tertiary {
      background: #ecf0f1;
      color: #2c3e50;
    }

    .btn-action.tertiary:hover {
      background: #d5dbdb;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .quick-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .subject-detail-container {
        padding: 1rem;
      }

      .filters {
        grid-template-columns: 1fr;
      }

      .worksheets-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .worksheets-container.grid-view {
        grid-template-columns: 1fr;
      }

      .quick-actions {
        flex-direction: column;
        align-items: center;
      }

      .btn-action {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class SubjectDetailComponent implements OnInit {
  subjectName: string = '';
  grade: string = '';
  
  worksheets: SubjectWorksheet[] = [];
  filteredWorksheets: SubjectWorksheet[] = [];
  availableTopics: string[] = [];
  
  // Filters
  selectedDifficulty: string = '';
  selectedTopic: string = '';
  searchTerm: string = '';
  
  // View options
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private route: ActivatedRoute,
    private worksheetService: WorksheetService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.subjectName = params['subject'];
      this.grade = params['grade'];
      this.loadWorksheets();
    });
  }

  private loadWorksheets(): void {
    // In a real implementation, this would fetch from the worksheet service
    // For now, using mock data
    this.worksheets = [
      {
        id: `${this.subjectName}-${this.grade}-001`,
        title: 'Introduction to Basic Concepts',
        description: 'Fundamental concepts and basic operations for getting started.',
        difficulty: 'easy',
        topics: ['Fundamentals', 'Basic Operations'],
        estimatedTime: 30,
        totalMarks: 25,
        lastModified: '2024-01-15'
      },
      {
        id: `${this.subjectName}-${this.grade}-002`,
        title: 'Intermediate Problem Solving',
        description: 'More complex problems that build on foundational knowledge.',
        difficulty: 'medium',
        topics: ['Problem Solving', 'Applications'],
        estimatedTime: 45,
        totalMarks: 40,
        lastModified: '2024-01-14'
      },
      {
        id: `${this.subjectName}-${this.grade}-003`,
        title: 'Advanced Challenges',
        description: 'Complex problems for students ready for greater challenges.',
        difficulty: 'hard',
        topics: ['Advanced Concepts', 'Critical Thinking'],
        estimatedTime: 60,
        totalMarks: 50,
        lastModified: '2024-01-13'
      }
    ];

    // Extract unique topics
    this.availableTopics = Array.from(
      new Set(this.worksheets.flatMap(w => w.topics))
    ).sort();

    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredWorksheets = this.worksheets.filter(worksheet => {
      const matchesDifficulty = !this.selectedDifficulty || worksheet.difficulty === this.selectedDifficulty;
      const matchesTopic = !this.selectedTopic || worksheet.topics.includes(this.selectedTopic);
      const matchesSearch = !this.searchTerm || 
        worksheet.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        worksheet.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        worksheet.topics.some(topic => topic.toLowerCase().includes(this.searchTerm.toLowerCase()));

      return matchesDifficulty && matchesTopic && matchesSearch;
    });
  }

  clearFilters(): void {
    this.selectedDifficulty = '';
    this.selectedTopic = '';
    this.searchTerm = '';
    this.applyFilters();
  }

  openWorksheet(id: string): void {
    // Navigate to worksheet viewer
    console.log('Opening worksheet:', id);
    // In real implementation: this.router.navigate(['/worksheet', id]);
  }

  downloadWorksheet(id: string): void {
    // Download worksheet using the worksheet service
    // First get the worksheet, then export it
    const mockWorksheet = this.worksheets.find(w => w.id === id);
    if (mockWorksheet) {
      // In a real implementation, this would load the actual worksheet content
      const worksheetContent = {
        metadata: {
          id: mockWorksheet.id,
          title: mockWorksheet.title,
          subject: this.subjectName,
          grade: parseInt(this.grade),
          topic: mockWorksheet.topics[0],
          difficulty: mockWorksheet.difficulty,
          totalMarks: mockWorksheet.totalMarks,
          estimatedTime: mockWorksheet.estimatedTime,
          filePath: '',
          learningObjectives: []
        },
        content: `# ${mockWorksheet.title}\n\nThis is a sample worksheet content.`
      };
      
      this.worksheetService.exportToPdf(worksheetContent).then(() => {
        console.log('Downloaded:', id);
      }).catch((error: any) => {
        console.error('Download failed:', error);
      });
    }
  }

  toggleFavorite(id: string): void {
    // Toggle favorite status
    console.log('Toggling favorite for:', id);
  }

  isFavorite(id: string): boolean {
    // Check if worksheet is favorited
    return false; // Placeholder
  }

  getSubjectIcon(subject: string): string {
    const icons: { [key: string]: string } = {
      'mathematics': '🔢',
      'science': '🔬',
      'english': '📝',
      'history': '🏛️',
      'geography': '🌍',
      'art': '🎨',
      'music': '🎵',
      'physical-education': '⚽'
    };
    return icons[subject.toLowerCase()] || '📚';
  }
}

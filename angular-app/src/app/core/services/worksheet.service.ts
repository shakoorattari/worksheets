import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { marked } from 'marked';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface WorksheetMetadata {
  id: string;
  title: string;
  subject: string;
  grade: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalMarks: number;
  estimatedTime: number;
  filePath: string;
  answerKeyPath?: string;
  learningObjectives: string[];
  curriculum?: string;
  createdDate?: Date;
  modifiedDate?: Date;
}

export interface WorksheetContent {
  metadata: WorksheetMetadata;
  content: string;
  answerKey?: string;
  htmlContent?: string;
  answerKeyHtml?: string;
}

export interface ExportOptions {
  format: 'html' | 'pdf';
  includeAnswers: boolean;
  paperSize: 'a4' | 'letter';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  headerText?: string;
  footerText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorksheetService {
  private worksheetsSubject = new BehaviorSubject<WorksheetMetadata[]>([]);
  public worksheets$ = this.worksheetsSubject.asObservable();

  private loadedWorksheets = new Map<string, WorksheetContent>();

  constructor(private http: HttpClient) {
    this.configureMarked();
    this.loadWorksheetIndex();
  }

  private configureMarked(): void {
    // Configure marked with modern options
    marked.setOptions({
      gfm: true,
      breaks: true
    });

    // Set up custom renderer for educational content
    const renderer = new marked.Renderer();
    
    // Override code rendering for math expressions
    renderer.code = function(code: string, language: string | undefined) {
      if (language === 'math') {
        // Simple math rendering fallback without KaTeX
        return `<div class="math-expression">${code}</div>`;
      }
      return `<pre><code class="language-${language || ''}">${code}</code></pre>`;
    };

    marked.setOptions({ renderer });
  }

  private async loadWorksheetIndex(): Promise<void> {
    try {
      // Load the worksheet index from JSON file
      const indexData = await this.http.get<{worksheets: WorksheetMetadata[]}>('/assets/worksheets-index.json').toPromise();
      if (indexData && indexData.worksheets) {
        this.worksheetsSubject.next(indexData.worksheets);
      }
    } catch (error) {
      console.error('Error loading worksheet index:', error);
      // Fallback to empty array if index fails to load
      this.worksheetsSubject.next([]);
    }
  }

  async loadWorksheet(id: string): Promise<WorksheetContent | null> {
    if (this.loadedWorksheets.has(id)) {
      return this.loadedWorksheets.get(id)!;
    }

    // Load from JSON file
    const content = await this.loadWorksheetFromId(id);
    if (content) {
      this.loadedWorksheets.set(id, content);
    }
    return content;
  }

  // Method to load worksheet content from JSON files (since browser can't directly read .md files)
  async loadWorksheetFromId(worksheetId: string): Promise<WorksheetContent | null> {
    try {
      // Load worksheet content from JSON file
      const response = await fetch(`assets/worksheets/${worksheetId}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load worksheet: ${response.status}`);
      }
      
      const worksheetData = await response.json();
      
      // Convert markdown content to HTML
      const htmlContent = this.convertToHtml(worksheetData.content);
      const answerKeyHtml = worksheetData.answerKey ? this.convertToHtml(worksheetData.answerKey) : undefined;
      
      const worksheetContent: WorksheetContent = {
        metadata: {
          id: worksheetData.id,
          title: worksheetData.metadata.title,
          subject: worksheetData.metadata.subject,
          grade: worksheetData.metadata.grade,
          topic: worksheetData.metadata.topic,
          difficulty: worksheetData.metadata.difficulty,
          totalMarks: worksheetData.metadata.totalMarks,
          estimatedTime: worksheetData.metadata.estimatedTime,
          filePath: `assets/worksheets/${worksheetId}.json`,
          learningObjectives: worksheetData.metadata.learningObjectives || [],
          curriculum: worksheetData.metadata.curriculum || 'General',
          createdDate: new Date(),
          modifiedDate: new Date()
        },
        content: worksheetData.content,
        htmlContent,
        answerKey: worksheetData.answerKey,
        answerKeyHtml
      };
      
      return worksheetContent;
    } catch (error) {
      console.error('Error loading worksheet:', error);
      return null;
    }
  }

  convertToHtml(markdown: string): string {
    return marked(markdown);
  }

  async exportToPdf(
    worksheet: WorksheetContent, 
    options: ExportOptions = this.getDefaultExportOptions()
  ): Promise<Blob> {
    const htmlContent = this.generateExportHtml(worksheet, options);
    
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '210mm'; // A4 width
    document.body.appendChild(container);

    try {
      // Convert to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: options.paperSize
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = options.paperSize === 'a4' ? 210 : 216; // A4 or Letter width
      const pageHeight = options.paperSize === 'a4' ? 297 : 280; // A4 or Letter height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add header if specified
      if (options.headerText) {
        pdf.setFontSize(10);
        pdf.text(options.headerText, imgWidth / 2, 15, { align: 'center' });
      }

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Add footer if specified
      if (options.footerText) {
        const pageCount = pdf.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.text(options.footerText, imgWidth / 2, pageHeight - 15, { align: 'center' });
        }
      }

      return pdf.output('blob');
    } finally {
      document.body.removeChild(container);
    }
  }

  exportToHtml(worksheet: WorksheetContent, options: ExportOptions): string {
    return this.generateExportHtml(worksheet, options);
  }

  private generateExportHtml(worksheet: WorksheetContent, options: ExportOptions): string {
    const { metadata, htmlContent, answerKeyHtml } = worksheet;
    
    const header = options.headerText || `${metadata.title} - Grade ${metadata.grade} Mathematics`;
    const footer = options.footerText || '© 2024-2025 Shakoor Hussain Attari | Educational Materials';

    const answerSection = options.includeAnswers && answerKeyHtml 
      ? `<div class="page-break"></div>${answerKeyHtml}` 
      : '';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title}</title>
    <style>
        @page {
            size: ${options.paperSize.toUpperCase()};
            margin: ${options.margins.top}mm ${options.margins.right}mm ${options.margins.bottom}mm ${options.margins.left}mm;
            
            @top-center {
                content: "${header}";
                font-size: 10pt;
                font-family: 'Times New Roman', serif;
                color: #333;
                border-bottom: 1px solid #ddd;
                padding-bottom: 0.2cm;
            }
            
            @bottom-center {
                content: "${footer}";
                font-size: 10pt;
                font-family: 'Times New Roman', serif;
                color: #666;
                border-top: 1px solid #ddd;
                padding-top: 0.2cm;
            }
        }
        
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            background: white;
            margin: 0;
            padding: 1cm;
        }
        
        h1 { font-size: 18pt; text-align: center; }
        h2 { font-size: 16pt; border-bottom: 1px solid #000; }
        h3 { font-size: 14pt; }
        
        .page-break { page-break-before: always; }
    </style>
</head>
<body>
    ${htmlContent}
    ${answerSection}
</body>
</html>`;
  }

  private getDefaultExportOptions(): ExportOptions {
    return {
      format: 'pdf',
      includeAnswers: false,
      paperSize: 'a4',
      orientation: 'portrait',
      margins: {
        top: 20,
        right: 15,
        bottom: 20,
        left: 15
      },
      headerText: undefined,
      footerText: '© 2024-2025 Shakoor Hussain Attari | Educational Materials'
    };
  }

  // Observable methods for getting worksheets
  getWorksheets(): Observable<WorksheetMetadata[]> {
    return this.worksheets$;
  }

  getWorksheetsBySubject(subject: string): Observable<WorksheetMetadata[]> {
    return this.worksheets$.pipe(
      map(worksheets => worksheets.filter(w => w.subject === subject))
    );
  }

  getWorksheetsByGrade(grade: number): Observable<WorksheetMetadata[]> {
    return this.worksheets$.pipe(
      map(worksheets => worksheets.filter(w => w.grade === grade))
    );
  }

  getWorksheetsByDifficulty(difficulty: string): Observable<WorksheetMetadata[]> {
    return this.worksheets$.pipe(
      map(worksheets => worksheets.filter(w => w.difficulty === difficulty))
    );
  }

  searchWorksheets(query: string): Observable<WorksheetMetadata[]> {
    return this.worksheets$.pipe(
      map(worksheets => worksheets.filter(w => 
        w.title.toLowerCase().includes(query.toLowerCase()) ||
        w.topic.toLowerCase().includes(query.toLowerCase()) ||
        w.subject.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  // Get worksheets filtered by criteria
  getWorksheetsByFilter(filters: {
    subject?: string;
    grade?: number;
    topic?: string;
    difficulty?: string;
    searchTerm?: string;
  }): Observable<WorksheetMetadata[]> {
    return this.worksheets$.pipe(
      map(worksheets => worksheets.filter(worksheet => {
        const matchesSubject = !filters.subject || worksheet.subject === filters.subject;
        const matchesGrade = !filters.grade || worksheet.grade === filters.grade;
        const matchesTopic = !filters.topic || worksheet.topic === filters.topic;
        const matchesDifficulty = !filters.difficulty || worksheet.difficulty === filters.difficulty;
        const matchesSearch = !filters.searchTerm || 
          worksheet.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          worksheet.topic.toLowerCase().includes(filters.searchTerm.toLowerCase());
        
        return matchesSubject && matchesGrade && matchesTopic && matchesDifficulty && matchesSearch;
      }))
    );
  }
}
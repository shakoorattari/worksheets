import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="not-found-container">
      <mat-card class="not-found-card">
        <mat-card-content>
          <div class="error-content">
            <mat-icon class="error-icon">error_outline</mat-icon>
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you're looking for doesn't exist.</p>
            <div class="actions">
              <button mat-raised-button color="primary" routerLink="/">
                <mat-icon>home</mat-icon>
                Go Home
              </button>
              <button mat-raised-button routerLink="/browse">
                <mat-icon>search</mat-icon>
                Browse Worksheets
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 50vh;
      padding: 24px;
    }

    .not-found-card {
      max-width: 500px;
      width: 100%;
    }

    .error-content {
      text-align: center;
      padding: 32px;
    }

    .error-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #ff6b6b;
      margin-bottom: 24px;
    }

    h1 {
      font-size: 2rem;
      margin: 0 0 16px 0;
      color: #333;
    }

    p {
      font-size: 1.1rem;
      color: #666;
      margin: 0 0 32px 0;
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 480px) {
      .actions {
        flex-direction: column;
      }

      .actions button {
        width: 100%;
      }
    }
  `]
})
export class NotFoundComponent {}

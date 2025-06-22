import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div style="padding: 24px;">
      <h1>My Collections</h1>
      <mat-card>
        <mat-card-content>
          <p>Organize your favorite worksheets into collections. This feature is coming soon!</p>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class CollectionsComponent {}

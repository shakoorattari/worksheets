import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div style="padding: 24px;">
      <h1>Subjects</h1>
      <mat-card>
        <mat-card-content>
          <p>Browse worksheets by subject. Currently featuring Mathematics with more subjects coming soon!</p>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class SubjectsComponent {}

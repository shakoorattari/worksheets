import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div style="padding: 24px;">
      <h1>Worksheet Generator</h1>
      <mat-card>
        <mat-card-content>
          <p>Dynamic worksheet generator coming soon! This feature will allow you to create custom worksheets on the fly.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class GeneratorComponent {}

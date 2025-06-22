import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <div class="app-container">
      <!-- Main Toolbar -->
      <mat-toolbar class="app-toolbar" color="primary">
        <button
          type="button"
          aria-label="Toggle sidenav"
          mat-icon-button
          (click)="drawer.toggle()"
          *ngIf="isHandset$ | async">
          <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
        </button>
        
        <span class="app-title">
          <mat-icon class="logo-icon">school</mat-icon>
          Educational Worksheets
        </span>
        
        <span class="spacer"></span>
        
        <!-- Quick Actions -->
        <button mat-icon-button aria-label="Search" title="Search Worksheets">
          <mat-icon>search</mat-icon>
        </button>
        
        <button mat-icon-button aria-label="Settings" title="Settings">
          <mat-icon>settings</mat-icon>
        </button>
        
        <button mat-icon-button aria-label="Help" title="Help & Documentation">
          <mat-icon>help</mat-icon>
        </button>
      </mat-toolbar>

      <!-- Sidenav Container -->
      <mat-sidenav-container class="sidenav-container">
        <!-- Side Navigation -->
        <mat-sidenav 
          #drawer 
          class="sidenav" 
          fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">
          
          <mat-toolbar class="sidenav-toolbar">Navigation</mat-toolbar>
          
          <mat-nav-list>
            <!-- Dashboard -->
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            
            <!-- Browse Worksheets -->
            <a mat-list-item routerLink="/browse" routerLinkActive="active">
              <mat-icon matListItemIcon>library_books</mat-icon>
              <span matListItemTitle>Browse Worksheets</span>
            </a>
            
            <!-- Worksheet Generator -->
            <a mat-list-item routerLink="/generator" routerLinkActive="active">
              <mat-icon matListItemIcon>create</mat-icon>
              <span matListItemTitle>Worksheet Generator</span>
            </a>
            
            <!-- My Collections -->
            <a mat-list-item routerLink="/collections" routerLinkActive="active">
              <mat-icon matListItemIcon>bookmark</mat-icon>
              <span matListItemTitle>My Collections</span>
            </a>
            
            <mat-divider></mat-divider>
            
            <!-- Subject Areas -->
            <h3 mat-subheader>Subject Areas</h3>
            
            <a mat-list-item routerLink="/subjects/mathematics" routerLinkActive="active">
              <mat-icon matListItemIcon>calculate</mat-icon>
              <span matListItemTitle>Mathematics</span>
            </a>
            
            <a mat-list-item routerLink="/subjects/science" routerLinkActive="active">
              <mat-icon matListItemIcon>science</mat-icon>
              <span matListItemTitle>Science</span>
            </a>
            
            <a mat-list-item routerLink="/subjects/english" routerLinkActive="active">
              <mat-icon matListItemIcon>auto_stories</mat-icon>
              <span matListItemTitle>English</span>
            </a>
            
            <mat-divider></mat-divider>
            
            <!-- Tools & Resources -->
            <h3 mat-subheader>Tools & Resources</h3>
            
            <a mat-list-item routerLink="/analytics" routerLinkActive="active">
              <mat-icon matListItemIcon>analytics</mat-icon>
              <span matListItemTitle>Analytics</span>
            </a>
            
            <a mat-list-item routerLink="/settings" routerLinkActive="active">
              <mat-icon matListItemIcon>settings</mat-icon>
              <span matListItemTitle>Settings</span>
            </a>
            
            <a mat-list-item routerLink="/about" routerLinkActive="active">
              <mat-icon matListItemIcon>info</mat-icon>
              <span matListItemTitle>About</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>
        
        <!-- Main Content -->
        <mat-sidenav-content class="main-content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .logo-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .sidenav-container {
      flex: 1;
      margin-top: 64px; /* Toolbar height */
    }

    .sidenav {
      width: 280px;
      background: #fafafa;
      border-right: 1px solid #e0e0e0;
    }

    .sidenav-toolbar {
      background: transparent;
      color: #666;
      font-weight: 500;
      border-bottom: 1px solid #e0e0e0;
      min-height: 56px;
    }

    .main-content {
      background: #f5f5f5;
    }

    .content-wrapper {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Navigation styles */
    .mat-mdc-list-item.active {
      background-color: rgba(63, 81, 181, 0.1);
      color: #3f51b5;
    }

    .mat-mdc-list-item.active .mat-icon {
      color: #3f51b5;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .content-wrapper {
        padding: 16px;
      }
      
      .sidenav {
        width: 100%;
      }
    }

    /* Custom Material overrides */
    .mat-mdc-list-item {
      transition: background-color 0.2s ease;
    }

    .mat-mdc-list-item:hover {
      background-color: rgba(0,0,0,0.04);
    }

    /* Toolbar button spacing */
    .app-toolbar button {
      margin-left: 8px;
    }

    .app-toolbar button:first-child {
      margin-left: 0;
    }
  `]
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    // Initialize any app-level logic here
    console.log('🚀 Educational Worksheets Platform initialized');
  }
}

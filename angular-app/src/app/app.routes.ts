import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  
  // Dashboard - Lazy loaded
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard - Educational Worksheets'
  },
  
  // Browse Worksheets - Lazy loaded
  {
    path: 'browse',
    loadComponent: () => import('./features/browse/browse.component').then(m => m.BrowseComponent),
    title: 'Browse Worksheets'
  },
  
  // Worksheet Generator - Lazy loaded
  {
    path: 'generator',
    loadComponent: () => import('./features/generator/generator.component').then(m => m.GeneratorComponent),
    title: 'Worksheet Generator'
  },
  
  // Collections - Lazy loaded
  {
    path: 'collections',
    loadComponent: () => import('./features/collections/collections.component').then(m => m.CollectionsComponent),
    title: 'My Collections'
  },
  
  // Subject areas - Lazy loaded modules
  {
    path: 'subjects',
    loadChildren: () => import('./features/subjects/subjects.routes').then(m => m.subjectRoutes),
    title: 'Subjects'
  },
  
  // Analytics - Lazy loaded
  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
    title: 'Analytics'
  },
  
  // Settings - Lazy loaded
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    title: 'Settings'
  },
  
  // About - Lazy loaded
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent),
    title: 'About'
  },
  
  // Worksheet viewer - Dynamic route
  {
    path: 'worksheet/:id',
    loadComponent: () => import('./features/worksheet-viewer/worksheet-viewer.component').then(m => m.WorksheetViewerComponent),
    title: 'Worksheet Viewer'
  },
  
  // 404 fallback
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found'
  }
];

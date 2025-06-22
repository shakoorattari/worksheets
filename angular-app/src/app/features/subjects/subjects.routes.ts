import { Routes } from '@angular/router';

export const subjectRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./subjects.component').then(m => m.SubjectsComponent),
    title: 'Subjects Overview'
  }
];

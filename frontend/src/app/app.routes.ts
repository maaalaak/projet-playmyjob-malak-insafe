import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '**',
    title: 'Page introuvable · PlayMyJob',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];

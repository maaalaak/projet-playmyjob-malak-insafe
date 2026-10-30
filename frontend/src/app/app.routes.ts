import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'PlayMyJob',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: '**',
    title: 'Page introuvable · PlayMyJob',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];

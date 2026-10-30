import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'PlayMyJob',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    title: 'Connexion · PlayMyJob',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '**',
    title: 'Page introuvable · PlayMyJob',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];

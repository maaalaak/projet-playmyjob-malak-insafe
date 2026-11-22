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
    path: 'register',
    title: 'Inscription · PlayMyJob',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'offers',
    title: 'Offres · PlayMyJob',
    loadComponent: () => import('./pages/offers/offers').then((m) => m.Offers),
  },
  {
    path: 'offers/:id',
    title: "Détail de l'offre · PlayMyJob",
    loadComponent: () => import('./pages/offer-detail/offer-detail').then((m) => m.OfferDetail),
  },
  {
    path: '**',
    title: 'Page introuvable · PlayMyJob',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];

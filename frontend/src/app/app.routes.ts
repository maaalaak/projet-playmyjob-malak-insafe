import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'PlayMyJob',
    loadComponent: () => import('./components/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    title: 'Connexion · PlayMyJob',
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    title: 'Inscription · PlayMyJob',
    loadComponent: () => import('./components/register/register').then((m) => m.Register),
  },
  {
    path: 'offers',
    title: 'Offres · PlayMyJob',
    loadComponent: () => import('./components/offers/offers').then((m) => m.Offers),
  },
  {
    path: 'offers/:id',
    title: "Détail de l'offre · PlayMyJob",
    loadComponent: () => import('./components/offer-detail/offer-detail').then((m) => m.OfferDetail),
  },
  {
    path: 'favorites',
    title: 'Mes favoris · PlayMyJob',
    canActivate: [authGuard],
    loadComponent: () => import('./components/favorites/favorites').then((m) => m.Favorites),
  },
  {
    path: 'profile',
    title: 'Mon profil · PlayMyJob',
    canActivate: [authGuard],
    loadComponent: () => import('./components/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'simulation/:offerId',
    title: 'Simulation · PlayMyJob',
    canActivate: [authGuard],
    loadComponent: () => import('./components/simulation/simulation').then((m) => m.SimulationPage),
  },
  {
    path: 'result/:id',
    title: 'Ton résultat · PlayMyJob',
    canActivate: [authGuard],
    loadComponent: () => import('./components/result/result').then((m) => m.Result),
  },
  {
    path: '**',
    title: 'Page introuvable · PlayMyJob',
    loadComponent: () => import('./components/not-found/not-found').then((m) => m.NotFound),
  },
];

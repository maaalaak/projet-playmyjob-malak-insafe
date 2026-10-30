import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationLink } from '../../interfaces/navigation-link';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  protected readonly links: readonly NavigationLink[] = [
    { label: 'Accueil', path: '/' },
    { label: 'Offres', path: '/offers' },
    { label: 'Favoris', path: '/favorites' },
    { label: 'Profil', path: '/profile' },
  ];
}

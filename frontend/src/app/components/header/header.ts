import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationLink } from '../../interfaces/navigation-link';
import { AuthService } from '../../services/auth-service';

@Component({
  imports: [MatButtonModule, RouterLink, RouterLinkActive],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  private readonly router: Router = inject(Router);

  protected readonly authService: AuthService = inject(AuthService);
  protected readonly links: readonly NavigationLink[] = [
    { label: 'Accueil', path: '/' },
    { label: 'Offres', path: '/offers' },
    { label: 'Favoris', path: '/favorites' },
    { label: 'Profil', path: '/profile' },
  ];

  protected logout(): void {
    this.authService.logout();
    void this.router.navigate(['/']);
  }
}

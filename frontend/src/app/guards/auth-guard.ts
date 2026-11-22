import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  return inject(AuthService).isLoggedIn() || inject(Router).createUrlTree(['/login']);
};

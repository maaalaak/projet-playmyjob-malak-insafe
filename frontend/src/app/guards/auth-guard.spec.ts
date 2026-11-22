import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  function runGuard(): ReturnType<typeof authGuard> {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
  }

  afterEach(() => localStorage.clear());

  it('redirects to the login page when nobody is logged in', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });

    const result = runGuard() as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/login');
  });

  it('opens the page when the user is logged in', () => {
    localStorage.setItem('playmyjob.session', JSON.stringify({ token: 'jeton', user: {} }));
    TestBed.configureTestingModule({ providers: [provideRouter([])] });

    expect(runGuard()).toBe(true);
  });
});

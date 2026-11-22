import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthResponse } from '../interfaces/auth-response';
import { AuthService } from './auth-service';

const RESPONSE: AuthResponse = {
  token: 'jeton',
  user: { id: '1', firstName: 'Malak', lastName: 'Melhaoui', email: 'malak@example.com', createdAt: '2026-11-22' },
};

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('saves the session after a login and clears it after a logout', () => {
    service.login({ email: 'malak@example.com', password: 'motdepasse' }).subscribe();
    httpTesting.expectOne({ method: 'POST', url: '/api/auth/login' }).flush(RESPONSE);

    expect(service.isLoggedIn()).toBe(true);
    expect(service.user()?.firstName).toBe('Malak');

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.length).toBe(0);
  });
});

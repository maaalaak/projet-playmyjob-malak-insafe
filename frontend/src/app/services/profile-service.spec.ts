import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth-service';
import { ProfileService } from './profile-service';

describe('ProfileService', () => {
  beforeEach(() => {
    localStorage.setItem('playmyjob.session', JSON.stringify({ token: 'jeton', user: { firstName: 'Ancien' } }));
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
  });

  afterEach(() => localStorage.clear());

  it('updates the user of the session after a profile change', () => {
    TestBed.inject(ProfileService).update({ firstName: 'Malak', lastName: 'Melhaoui', email: 'malak@example.com' }).subscribe();

    TestBed.inject(HttpTestingController)
      .expectOne({ method: 'PUT', url: '/api/profile' })
      .flush({ id: '1', firstName: 'Malak', lastName: 'Melhaoui', email: 'malak@example.com', createdAt: '2026-11-22' });

    const authService: AuthService = TestBed.inject(AuthService);
    expect(authService.user()?.firstName).toBe('Malak');
    expect(authService.token()).toBe('jeton');
  });
});

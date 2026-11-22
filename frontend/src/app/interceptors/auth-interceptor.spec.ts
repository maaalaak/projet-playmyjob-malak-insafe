import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  beforeEach(() => {
    localStorage.setItem('playmyjob.session', JSON.stringify({ token: 'jeton', user: {} }));
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
  });

  afterEach(() => localStorage.clear());

  it('adds the token to every request', () => {
    TestBed.inject(HttpClient).get('/api/profile').subscribe();

    const request = TestBed.inject(HttpTestingController).expectOne('/api/profile');
    expect(request.request.headers.get('Authorization')).toBe('Bearer jeton');
    request.flush({});
  });
});

import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, Signal, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../interfaces/auth-response';
import { LoginRequest } from '../interfaces/login-request';
import { RegisterRequest } from '../interfaces/register-request';
import { User } from '../interfaces/user';

const SESSION_KEY: string = 'playmyjob.session';

function isAuthResponse(value: unknown): value is AuthResponse {
  return typeof value === 'object' && value !== null && typeof (value as AuthResponse).token === 'string';
}

@Service()
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.apiUrl}/auth`;
  private readonly session: WritableSignal<AuthResponse | null> = signal(this.readSession());

  public readonly user: Signal<User | null> = computed(() => this.session()?.user ?? null);
  public readonly token: Signal<string | null> = computed(() => this.session()?.token ?? null);
  public readonly isLoggedIn: Signal<boolean> = computed(() => this.session() !== null);

  public register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(tap((response: AuthResponse) => this.saveSession(response)));
  }

  public login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap((response: AuthResponse) => this.saveSession(response)));
  }

  public logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this.session.set(null);
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(response));
    this.session.set(response);
  }

  private readSession(): AuthResponse | null {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null');
      return isAuthResponse(saved) ? saved : null;
    } catch {
      return null;
    }
  }
}

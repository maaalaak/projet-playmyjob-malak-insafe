import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { UpdateProfileRequest } from '../interfaces/update-profile-request';
import { User } from '../interfaces/user';
import { AuthService } from './auth-service';

@Service()
export class ProfileService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly authService: AuthService = inject(AuthService);
  private readonly apiUrl: string = `${environment.apiUrl}/profile`;

  public get(): Observable<User> {
    return this.http.get<User>(this.apiUrl);
  }

  public update(request: UpdateProfileRequest): Observable<User> {
    return this.http.put<User>(this.apiUrl, request).pipe(tap((user: User) => this.authService.updateUser(user)));
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { RegisterForm } from '../../interfaces/register-form';
import { AuthService } from '../../services/auth-service';
import { AuthLayout } from '../auth-layout/auth-layout';
import { httpErrorMessage } from '../../utils/http-error-message';
import { passwordsMatch } from '../../validators/passwords-match';

const PASSWORD_MIN_LENGTH: number = 8;

@Component({
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, RouterLink, AuthLayout],
  selector: 'app-register',
  templateUrl: './register.html',
})
export class Register {
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly passwordMinLength: number = PASSWORD_MIN_LENGTH;
  protected readonly submitting: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly error: WritableSignal<string | null> = signal<string | null>(null);

  protected readonly form: FormGroup<RegisterForm> = new FormGroup<RegisterForm>(
    {
      firstName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      lastName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)],
      }),
      passwordConfirmation: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: passwordsMatch },
  );

  protected submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { passwordConfirmation: _passwordConfirmation, ...request } = this.form.getRawValue();
    this.submitting.set(true);
    this.error.set(null);

    this.authService
      .register(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => void this.router.navigate(['/offers']),
        error: (error: HttpErrorResponse) => {
          this.error.set(httpErrorMessage(error));
          this.submitting.set(false);
        },
      });
  }
}

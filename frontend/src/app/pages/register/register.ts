import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { RegisterForm } from '../../interfaces/register-form';
import { AuthLayout } from '../../shared/components/auth-layout/auth-layout';
import { passwordsMatch } from '../../shared/validators/passwords-match';

@Component({
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, RouterLink, AuthLayout],
  selector: 'app-register',
  templateUrl: './register.html',
})
export class Register {
  private readonly router: Router = inject(Router);

  protected readonly form: FormGroup<RegisterForm> = new FormGroup<RegisterForm>(
    {
      firstName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      lastName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      passwordConfirmation: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: passwordsMatch },
  );

  protected submit(): void {
    if (this.form.valid) {
      void this.router.navigate(['/offers']);
    }
  }
}

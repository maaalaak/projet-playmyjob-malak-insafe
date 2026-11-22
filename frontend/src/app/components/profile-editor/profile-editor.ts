import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProfileForm } from '../../interfaces/profile-form';
import { User } from '../../interfaces/user';
import { ProfileService } from '../../services/profile-service';
import { httpErrorMessage } from '../../utils/http-error-message';

const NAME_MAX_LENGTH: number = 50;

function nameControl(): FormControl<string> {
  return new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(NAME_MAX_LENGTH)],
  });
}

@Component({
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.html',
})
export class ProfileEditor {
  private readonly profileService: ProfileService = inject(ProfileService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly saving: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly saved: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly error: WritableSignal<string | null> = signal<string | null>(null);

  protected readonly form: FormGroup<ProfileForm> = new FormGroup<ProfileForm>({
    firstName: nameControl(),
    lastName: nameControl(),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  });

  constructor() {
    this.profileService
      .get()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: User) => this.fill(user),
        error: (error: HttpErrorResponse) => this.error.set(httpErrorMessage(error)),
      });
  }

  protected save(): void {
    if (this.form.invalid) {
      return;
    }

    this.saving.set(true);
    this.saved.set(false);
    this.error.set(null);

    this.profileService
      .update(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: User) => {
          this.fill(user);
          this.saving.set(false);
          this.saved.set(true);
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(httpErrorMessage(error));
          this.saving.set(false);
        },
      });
  }

  private fill(user: User): void {
    this.form.setValue({ firstName: user.firstName, lastName: user.lastName, email: user.email });
    this.form.markAsPristine();
  }
}

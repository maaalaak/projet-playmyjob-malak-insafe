import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password: unknown = group.get('password')?.value;
  const confirmation: unknown = group.get('passwordConfirmation')?.value;

  return password === confirmation ? null : { passwordsMismatch: true };
}

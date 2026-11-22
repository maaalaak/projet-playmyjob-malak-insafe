import { FormControl, FormGroup } from '@angular/forms';
import { passwordsMatch } from './passwords-match';

describe('passwordsMatch', () => {
  it('accepts identical passwords and refuses different ones', () => {
    const form = new FormGroup({
      password: new FormControl('secret'),
      passwordConfirmation: new FormControl('secret'),
    });
    expect(passwordsMatch(form)).toBeNull();

    form.controls.passwordConfirmation.setValue('autre');
    expect(passwordsMatch(form)).toEqual({ passwordsMismatch: true });
  });
});

import { HttpErrorResponse } from '@angular/common/http';
import { httpErrorMessage } from './http-error-message';

describe('httpErrorMessage', () => {
  it('shows the message sent by the backend', () => {
    const error = new HttpErrorResponse({ status: 401, error: { message: 'Email ou mot de passe incorrect' } });
    expect(httpErrorMessage(error)).toBe('Email ou mot de passe incorrect');
  });

  it('explains when the server does not answer', () => {
    expect(httpErrorMessage(new HttpErrorResponse({ status: 0 }))).toContain('ne répond pas');
  });
});

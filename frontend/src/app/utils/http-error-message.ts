import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../interfaces/api-error';

function isApiError(body: unknown): body is ApiError {
  return typeof body === 'object' && body !== null && typeof (body as ApiError).message === 'string';
}

export function httpErrorMessage(error: HttpErrorResponse): string {
  if (isApiError(error.error)) {
    return error.error.message;
  }
  if (error.status === 0) {
    return 'Le serveur ne répond pas. Réessaie dans un instant.';
  }
  return 'Une erreur est survenue. Réessaie dans un instant.';
}

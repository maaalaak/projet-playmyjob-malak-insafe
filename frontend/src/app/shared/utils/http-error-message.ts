import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../interfaces/api-error';

function isApiError(body: unknown): body is ApiError {
  return typeof body === 'object' && body !== null && typeof (body as ApiError).message === 'string';
}

export function httpErrorMessage(error: HttpErrorResponse): string {
  if (isApiError(error.error)) {
    return `${error.status} : ${error.error.message}`;
  }
  return error.status === 0 ? 'Le back ne répond pas (est-il démarré ?)' : `${error.status} : ${error.message}`;
}

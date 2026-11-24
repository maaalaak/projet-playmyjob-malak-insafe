import { HttpError } from './http-error.ts';

/** Codes renvoyés par une IA surchargée ou en panne passagère : un nouvel essai a des chances de réussir. */
const TEMPORARY_STATUSES: ReadonlySet<number> = new Set([429, 500, 502, 503, 504]);

/** Erreur d'une IA (Gemini ou Groq). Pour le navigateur, elle reste une erreur 502. */
export class AiProviderError extends HttpError {
  public readonly temporary: boolean;

  constructor(message: string, temporary: boolean = false) {
    super(502, message);
    this.name = 'AiProviderError';
    this.temporary = temporary;
  }

  public static fromStatus(provider: string, status: number): AiProviderError {
    return new AiProviderError(`${provider} a répondu ${status}`, TEMPORARY_STATUSES.has(status));
  }
}

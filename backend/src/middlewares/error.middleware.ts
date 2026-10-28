import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../errors/http-error.ts';

export interface ErrorBody {
  message: string;
}

export function notFoundHandler(_req: Request, res: Response<ErrorBody>): void {
  res.status(404).json({ message: 'Route introuvable' });
}

export function errorHandler(error: unknown, _req: Request, res: Response<ErrorBody>, _next: NextFunction): void {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  if (error instanceof ZodError) {
    res.status(502).json({ message: "La réponse de l'API externe n'a pas le format attendu" });
    return;
  }

  if (error instanceof DOMException && error.name === 'TimeoutError') {
    res.status(504).json({ message: "L'API externe met trop de temps à répondre" });
    return;
  }

  console.error(error);
  res.status(500).json({ message: 'Erreur interne du serveur' });
}

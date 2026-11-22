import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http-error.ts';
import { authService } from '../services/auth.service.ts';

const BEARER_PREFIX: string = 'Bearer ';

export interface AuthLocals {
  userId: string;
}

export function requireAuth(req: Request, res: Response<unknown, AuthLocals>, next: NextFunction): void {
  const header: string | undefined = req.headers.authorization;

  if (!header?.startsWith(BEARER_PREFIX)) {
    throw new HttpError(401, 'Connecte-toi pour continuer');
  }

  res.locals.userId = authService.verifyToken(header.slice(BEARER_PREFIX.length));
  next();
}

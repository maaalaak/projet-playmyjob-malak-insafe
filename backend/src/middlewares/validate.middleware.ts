import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodError, ZodType } from 'zod';
import type { ErrorBody } from './error.middleware.ts';

function invalidMessage(error: ZodError, source: string): string {
  const details: string = error.issues
    .map((issue) => `${issue.path.join('.') || source} : ${issue.message}`)
    .join(' ; ');
  return `Données invalides (${details})`;
}

export function validateBody(schema: ZodType): RequestHandler {
  return (req: Request, res: Response<ErrorBody>, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ message: invalidMessage(result.error, 'body') });
      return;
    }

    req.body = result.data;
    next();
  };
}

// Express 5 ne permet pas de remplacer req.query : les paramètres validés vont dans res.locals.query.
export function validateQuery(schema: ZodType): RequestHandler {
  return (req: Request, res: Response<ErrorBody>, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      res.status(400).json({ message: invalidMessage(result.error, 'query') });
      return;
    }

    res.locals['query'] = result.data;
    next();
  };
}

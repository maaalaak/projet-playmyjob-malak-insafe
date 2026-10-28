import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';
import type { ErrorBody } from './error.middleware.ts';

export function validateBody(schema: ZodType): RequestHandler {
  return (req: Request, res: Response<ErrorBody>, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details: string = result.error.issues
        .map((issue) => `${issue.path.join('.') || 'body'} : ${issue.message}`)
        .join(' ; ');
      res.status(400).json({ message: `Données invalides (${details})` });
      return;
    }

    req.body = result.data;
    next();
  };
}

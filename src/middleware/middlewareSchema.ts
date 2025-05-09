import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import { HttpStatusCode } from '../core/enums/HttpStatusCode';

export const middlewareSchema = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: 'Request body is required' });
      return;
    }

    const { error } = schema.validate(req.body, { abortEarly: true });

    if (error) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: error.details[0].message });
      return;
    }

    next();
  };
};

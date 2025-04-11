import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import { HttpStatusCode } from '../modules/common/enums/HttpStatusCode';

export const middlewareSchema = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: true });
    console.log('🚀 ~ return ~ result:', error);

    if (error)
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: error.details[0].message });

    next();
  };
};

import { Request } from 'express';

export interface IRequest extends Request {
  user?: {
    sub: string;
    email: string;
  };
}

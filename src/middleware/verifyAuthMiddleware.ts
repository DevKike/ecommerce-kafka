import { NextFunction, Response } from 'express';
import { IRequest } from '../modules/common/express/interfaces/IRequest';
import { UnauthorizedException } from '../modules/common/exceptions/UnauthorizedException';
import { jwtService } from '../modules/auth/services/jwtService';
import { JsonWebTokenError } from 'jsonwebtoken';
import { HttpStatusCode } from '../core/enums/HttpStatusCode';

export const verifyAuthMiddleware = () => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Token not provided');
      }

      const decoded = jwtService.verifyToken(token);

      if (!decoded.id || !decoded.email)
        throw new UnauthorizedException('Invalid token');

      req.user = {
        sub: decoded.id,
        email: decoded.email,
      };

      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: 'Malformed token' });
      } else if (error instanceof UnauthorizedException) {
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: 'Token expired' });
      } else if (error instanceof UnauthorizedException) {
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: error.message });
      } else {
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: 'Authentication failed' });
      }
    }
  };
};

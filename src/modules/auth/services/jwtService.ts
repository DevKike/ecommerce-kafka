import { ITokenPayload } from '../interfaces/IToken';
import jwt from 'jsonwebtoken';

export const jwtService = {
  signToken: (payload: ITokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
  },
};

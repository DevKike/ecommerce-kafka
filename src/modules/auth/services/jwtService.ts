import { CONSTANT_CONFIG } from '../../../core/constants/constantsConfig';
import { ITokenPayload } from '../interfaces/IToken';
import jwt from 'jsonwebtoken';

export const jwtService = {
  signToken: (payload: ITokenPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
  },

  verifyToken(token: string): ITokenPayload {
    try {
      return jwt.verify(
        token,
        CONSTANT_CONFIG.ENVIRONMENT.JWT_SECRET!
      ) as ITokenPayload;
    } catch (error) {
      throw error;
    }
  },
};

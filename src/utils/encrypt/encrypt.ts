import bcrypt from 'bcrypt';
import { CONSTANT_CONFIG } from '../../core/constants/constantsConfig';

export const hash = async (data: string): Promise<string> => {
  return await bcrypt.hash(data, CONSTANT_CONFIG.ENVIRONMENT.HASH_SALT);
};

export const compare = async (
  data: string,
  hashedData: string
): Promise<boolean> => {
  return await bcrypt.compare(data, hashedData);
};

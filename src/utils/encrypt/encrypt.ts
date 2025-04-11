import bcrypt from 'bcrypt';
import { CONSTANT } from '../../config/constants/constants';

export const hash = async (data: string): Promise<string> => {
  return await bcrypt.hash(data, CONSTANT.ENVIRONMENT.HASH_SALT);
};

export const compare = async (
  data: string,
  hashedData: string
): Promise<boolean> => {
  return await bcrypt.compare(data, hashedData);
};

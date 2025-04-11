import { hash } from '../../../utils/encrypt/encrypt';
import { AlreadyExistException } from '../../common/exceptions/AlreadyExistsException';
import { IUser, IUserCreate } from '../interfaces/IUser';
import { findByEmail, save } from '../services/userService';
import { v4 as uuidv4 } from 'uuid';

export const saveUser = async (userData: IUserCreate): Promise<IUser> => {
  const existingUser = await findByEmail(userData.email);

  if (existingUser) throw new AlreadyExistException('User already exists');

  const hashedPassword = await hash(userData.password);

  return await save({
    id: uuidv4(),
    name: userData.name,
    lastName: userData.lastName,
    email: userData.email,
    password: hashedPassword,
    phone: userData.phone,
  });
};

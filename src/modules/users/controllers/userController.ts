import { IUser, IUserCreate } from '../interfaces/IUser';
import { save } from '../services/userService';
import { v4 as uuidv4 } from 'uuid';

export const saveUser = async (userData: IUserCreate): Promise<IUser> => {
  try {
    const user: IUser = {
      id: uuidv4(),
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
    };

    return await save(user);
  } catch (error) {
    throw new Error(`Error saving user: ${error}`);
  }
};

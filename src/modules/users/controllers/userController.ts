import { encrypt } from '../../../utils/encrypt/encrypt';
import { IUser, IUserCreate } from '../interfaces/IUser';
import { save } from '../services/userService';
import { v4 as uuidv4 } from 'uuid';

export const saveUser = async (userData: IUserCreate): Promise<IUser> => {
  try {
    const hashedPassword = await encrypt(userData.password);

    return await save({
      id: uuidv4(),
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone,
    });
  } catch (error) {
    throw new Error(`Error saving user: ${error}`);
  }
};

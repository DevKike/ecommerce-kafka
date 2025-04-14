import { IUser } from '../models/IUser';
import UserModel from '../models/userModel';

export const saveUser = async (user: IUser) => {
  try {
    const newUser = new UserModel(user);
    return await newUser.save();
  } catch (error) {
    throw error;
  }
};

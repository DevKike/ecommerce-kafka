import { IUser } from '../models/IUser';
import UserModel from '../models/userModel';

export const findByEmail = async (email: string): Promise<IUser | null> => {
  try {
    return await UserModel.findOne({ email });
  } catch (error) {
    throw error;
  }
};

export const findByPhone = async (phone: string): Promise<IUser | null> => {
  try {
    return await UserModel.findOne({ phone });
  } catch (error) {
    throw error;
  }
};

export const saveUser = async (user: IUser): Promise<IUser> => {
  try {
    const newUser = new UserModel(user);
    return await newUser.save();
  } catch (error) {
    throw error;
  }
};

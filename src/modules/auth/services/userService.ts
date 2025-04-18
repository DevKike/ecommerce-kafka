import { IUser } from '../models/IUser';
import UserModel from '../models/userModel';

export const userService = {
  findById: async (id: IUser['id']): Promise<IUser | null> => {
    try {
      return await UserModel.findOne({ id });
    } catch (error) {
      throw error;
    }
  },

  findByEmail: async (email: string): Promise<IUser | null> => {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  },

  findByPhone: async (phone: string): Promise<IUser | null> => {
    try {
      return await UserModel.findOne({ phone });
    } catch (error) {
      throw error;
    }
  },

  save: async (user: IUser): Promise<IUser> => {
    try {
      const newUser = new UserModel(user);
      return await newUser.save();
    } catch (error) {
      throw error;
    }
  },
};

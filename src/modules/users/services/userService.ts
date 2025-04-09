import { IUser } from '../interfaces/IUser';
import UserModel from '../models/userModel';

export const findById = async (id: IUser['id']): Promise<IUser> => {
  try {
    const user = await UserModel.findOne({ id });

    if (!user) {
      throw new Error(`User with UID ${id} not found`);
    }

    return user;
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error}`);
  }
};
export const findAll = async (): Promise<IUser[]> => {
  try {
    const users = await UserModel.find();
    return users;
  } catch (error) {
    throw new Error(`Error finding all users: ${error}`);
  }
};

export const save = async (user: IUser): Promise<IUser> => {
  try {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();

    return savedUser;
  } catch (error) {
    throw new Error(`Error saving user: ${error}`);
  }
};

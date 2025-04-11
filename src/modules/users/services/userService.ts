import { NotFoundException } from '../../common/exceptions/NotFoundException';
import { IUser } from '../interfaces/IUser';
import UserModel from '../models/userModel';

export const findById = async (id: IUser['id']): Promise<IUser> => {
  try {
    const user = await UserModel.findOne({ id });

    if (!user) throw new NotFoundException(`User with UID ${id} not found`);

    return user;
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error}`);
  }
};

export const findByEmail = async (email: string): Promise<IUser | null> => {
  try {
    return await UserModel.findOne({ email });
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error}`);
  }
};

export const findAll = async (): Promise<IUser[]> => {
  try {
    const users = await UserModel.find();

    if (!users || users.length === 0)
      throw new NotFoundException('No users found');

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

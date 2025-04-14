import { CONSTANT_CONFIG } from "../../../core/constants/constantsConfig";
import { compare } from "../../../utils/encrypt/encrypt";
import { UnauthorizedException } from "../../common/exceptions/UnauthorizedException";
import { ITokenPayload } from "../interfaces/IToken";
import { IUser, IUserLogin } from "../models/IUser";
import UserModel from "../models/userModel";
import jwt from "jsonwebtoken";
import { signToken } from "./jwtService";

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

export const login = async (
  loginData: IUserLogin
): Promise<{ user: IUser; token: string }> => {
  try {
    const user = await findByEmail(loginData.email);

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isPasswordValid = await compare(loginData.password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException("Invalid credentials");

    const tokenPayload: ITokenPayload = {
      id: user.id,
      email: user.email,
    };

    const token = signToken(tokenPayload);

    return { user, token };
  } catch (error) {
    throw error;
  }
};

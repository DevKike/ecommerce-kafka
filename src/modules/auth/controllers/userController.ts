import { hash } from '../../../utils/encrypt/encrypt';
import { eventService } from '../../common/services/eventService';
import { IEvent } from '../../common/events/interfaces/IEvent';
import { IUser, IUserCreate, IUserLogin, IUserResponse } from '../models/IUser';
import mongoose from 'mongoose';
import { CONSTANT_KAFKA } from '../../common/constants/constants';
import { userService } from '../services/userService';
import { userProducer } from '../producers/userProducer';
import { AlreadyExistException } from '../../common/exceptions/AlreadyExistsException';
import { ITokenPayload } from '../interfaces/IToken';
import { jwtService } from '../services/jwtService';
import { compare } from 'bcrypt';
import { UnauthorizedException } from '../../common/exceptions/UnauthorizedException';

export const userController = {
  registerUser: async (userData: IUserCreate): Promise<IUserResponse> => {
    const existingEmail = await userService.findByEmail(userData.email);

    if (existingEmail) throw new AlreadyExistException('User already exists');

    const existingPhone = await userService.findByPhone(userData.phone);

    if (existingPhone) throw new AlreadyExistException('User already exists');

    const hashedPassword = await hash(userData.password);
    const eventId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    const userEvent: IEvent = {
      id: `evt_${eventId.toString()}`,
      timestamp: new Date().toISOString(),
      source: CONSTANT_KAFKA.SOURCE.USER_SERVICE,
      topic: CONSTANT_KAFKA.TOPIC.USER.WELCOME_FLOW,
      payload: {
        id: `usr_${userId.toString()}`,
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
      },
      snapshot: {
        id: `usr_${userId.toString()}`,
        status: 'REGISTERED',
      },
    };

    await userProducer.send({
      topic: CONSTANT_KAFKA.TOPIC.USER.WELCOME_FLOW,
      messages: [
        {
          key: userEvent.id,
          value: JSON.stringify(userEvent),
        },
      ],
    });

    await eventService.save(userEvent);

    const userCreated = await userService.save({
      ...userData,
      password: hashedPassword,
      id: userId.toString(),
    });

    const userPlain = JSON.parse(JSON.stringify(userCreated));

    delete userPlain.password;
    delete userPlain._id;

    return userPlain;
  },

  loginUser: async (
    loginData: IUserLogin
  ): Promise<{ user: Omit<IUser, 'password'>; token: string }> => {
    const user = await userService.findByEmail(loginData.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await compare(loginData.password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const tokenPayload: ITokenPayload = {
      id: user.id,
      email: user.email,
    };

    const token = jwtService.signToken(tokenPayload);

    const eventId = new mongoose.Types.ObjectId();

    const loginEvent: IEvent = {
      id: `evt_${eventId.toString()}`,
      timestamp: new Date().toISOString(),
      source: CONSTANT_KAFKA.SOURCE.USER_SERVICE,
      topic: CONSTANT_KAFKA.TOPIC.USER.LOGIN,
      payload: {
        userid: user.id,
        email: user.email,
      },
      snapshot: {
        id: user.id,
        status: 'LOGGED_IN',
      },
    };

    await userProducer.send({
      topic: CONSTANT_KAFKA.TOPIC.USER.LOGIN,
      messages: [
        {
          key: loginEvent.id,
          value: JSON.stringify(loginEvent),
        },
      ],
    });

    await eventService.save(loginEvent);

    const userPlain = JSON.parse(JSON.stringify(user));

    delete userPlain.password;
    delete userPlain._id;

    return { user: userPlain, token };
  },
};

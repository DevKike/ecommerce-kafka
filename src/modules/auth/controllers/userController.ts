import { hash } from '../../../utils/encrypt/encrypt';
import { saveEvent } from '../../common/services/eventService';
import { IEvent } from '../../common/events/interfaces/IEvent';
import { IUser, IUserCreate, IUserLogin, IUserResponse } from '../models/IUser';
import mongoose from 'mongoose';
import { CONSTANT_KAFKA } from '../../common/constants/constants';
import {
  findByEmail,
  findByPhone,
  login,
  saveUser,
} from '../services/userService';
import { userProducer } from '../producers/userProducer';
import { AlreadyExistException } from '../../common/exceptions/AlreadyExistsException';

export const registerUser = async (
  userData: IUserCreate
): Promise<IUserResponse> => {
  const existingEmail = await findByEmail(userData.email);

  if (existingEmail) throw new AlreadyExistException('User already exists');

  const existingPhone = await findByPhone(userData.email);

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

  await saveEvent(userEvent);

  const userCreated = await saveUser({
    ...userData,
    password: hashedPassword,
    id: userId.toString(),
  });

  const userPlain = JSON.parse(JSON.stringify(userCreated));

  delete userPlain.password;
  delete userPlain._id;

  return userPlain;
};

export const loginUser = async (
  loginData: IUserLogin
): Promise<{ user: Omit<IUser, 'password'>; token: string }> => {
  const authResult = await login(loginData);

  const eventId = new mongoose.Types.ObjectId();

  const loginEvent: IEvent = {
    id: `evt_${eventId.toString()}`,
    timestamp: new Date().toISOString(),
    source: CONSTANT_KAFKA.SOURCE.USER_SERVICE,
    topic: CONSTANT_KAFKA.TOPIC.USER.LOGIN,
    payload: {
      userid: authResult.user.id,
      email: authResult.user.email,
    },
    snapshot: {
      id: authResult.user.id,
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

  await saveEvent(loginEvent);

  const userPlain = JSON.parse(JSON.stringify(authResult.user));

  delete userPlain.password;
  delete userPlain._id;

  return { user: userPlain, token: authResult.token };
};

import { hash } from '../../../utils/encrypt/encrypt';
import { saveEvent } from '../../common/services/eventService';
import { IEvent } from '../../common/events/interfaces/IEvent';
import { IUser, IUserCreate } from '../models/IUser';
import mongoose from 'mongoose';
import { CONSTANT_KAFKA } from '../../common/constants/constants';
import { saveUser } from '../services/userService';
import { userProducer } from '../producers/userProducer';

export const registerUser = async (userData: IUserCreate): Promise<IUser> => {
  /*  const existingUser = await findByEmail(userData.email);

  if (existingUser) throw new AlreadyExistException('User already exists'); */

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

  return await saveUser({
    ...userData,
    password: hashedPassword,
    id: userId.toString(),
  });
};

import EventModel from '../events/models/eventModel';
import { NotFoundException } from '../../common/exceptions/NotFoundException';
import { IEvent } from '../events/interfaces/IEvent';

/* export const findById = async (id: IEvent['id']): Promise<IEvent> => {
  try {
    const user = await EventModel.findOne({ id });

    if (!user) throw new NotFoundException(`User with UID ${id} not found`);

    return user;
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error}`);
  }
};

export const findByEmail = async (email: string): Promise<IEvent | null> => {
  try {
    return await EventModel.findOne({ email });
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error}`);
  }
};

export const findAll = async (): Promise<IEvent[]> => {
  try {
    const users = await EventModel.find();

    if (!users || users.length === 0)
      throw new NotFoundException('No users found');

    return users;
  } catch (error) {
    throw new Error(`Error finding all users: ${error}`);
  }
}; */

export const saveEvent = async (event: IEvent): Promise<IEvent> => {
  try {
    const newEvent = new EventModel(event);
    return await newEvent.save();
  } catch (error) {
    throw error;
  }
};

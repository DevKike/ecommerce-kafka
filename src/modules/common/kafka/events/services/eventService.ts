import { IEvent } from '../interfaces/IEvent';
import EventModel from '../models/eventModel';

export const eventService = {
  save: async (event: IEvent): Promise<IEvent> => {
    try {
      const newEvent = new EventModel(event);
      return await newEvent.save();
    } catch (error) {
      throw error;
    }
  },
};

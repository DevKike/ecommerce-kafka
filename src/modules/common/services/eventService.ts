import EventModel from '../events/models/eventModel';
import { IEvent } from '../events/interfaces/IEvent';

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

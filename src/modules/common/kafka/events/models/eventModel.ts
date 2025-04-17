import mongoose from 'mongoose';
import { IEvent } from '../interfaces/IEvent';

const eventSchema = new mongoose.Schema<IEvent>(
  {
    id: { type: String, require: true, unique: true },
    timestamp: { type: String, required: true },
    source: { type: String, required: true },
    topic: { type: String, required: true },
    payload: { type: Object, required: true },
    snapshot: { type: Object, required: true },
  },
  { versionKey: false }
);

const EventModel = mongoose.model<IEvent>('Event', eventSchema);

export default EventModel;

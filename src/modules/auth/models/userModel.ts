import mongoose from 'mongoose';
import { IUser } from './IUser';

const userSchema = new mongoose.Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
  },
  { versionKey: false }
);

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;

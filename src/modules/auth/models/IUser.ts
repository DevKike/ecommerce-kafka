export interface IUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface IUserCreate extends Omit<IUser, 'id'> {}

import { IUser } from '../../auth/models/IUser';

export interface ICartItem {
  id: string;
  productName: string;
  productId: string;
  quantity: number;
  addedAt: string;
  userId: IUser['id'];
}

export interface ICartItemCreate extends Omit<ICartItem, 'id' | 'addedAt'> {}

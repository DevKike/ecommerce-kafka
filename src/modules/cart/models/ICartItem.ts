import { IUser } from '../../auth/models/IUser';

export interface ICartItem {
  id: string;
  productId: string;
  quantity: number;
  addedAt: string;
  userId: IUser['id'];
  productName?: string;
}

export interface ICartItemCreate
  extends Omit<ICartItem, 'id' | 'addedAt' | 'productName'> {}

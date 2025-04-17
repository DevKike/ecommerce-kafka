import { IUser } from '../../auth/models/IUser';

export interface ICartProduct {
  productId: string;
  quantity: number;
  addedAt: string;
  productName?: string; 
}

export interface ICart {
  id: string;
  userId: IUser['id'];
  products: ICartProduct[];
  updatedAt: string;
  createdAt: string;
}

export interface ICartAddProduct {
  productId: string;
  quantity: number;
}

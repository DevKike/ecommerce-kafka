import e from 'express';

export interface ICartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface ICartItemCreate extends Omit<ICartItem, 'id' | 'addedAt'> {}

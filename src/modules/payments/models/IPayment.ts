export interface IPayment {
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

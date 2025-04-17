export interface IPayment {
  userId: string;
  items: [
    {
      productId: string;
      quantity: number;
      price: number;
    }
  ];
}

import { IProduct } from '../models/IProduct';
import { productService } from '../services/productService';

export const productController = {
  getAllProducts: async (): Promise<IProduct[]> => {
    try {
      return await productService.findAll();
    } catch (error) {
      throw error;
    }
  },
};

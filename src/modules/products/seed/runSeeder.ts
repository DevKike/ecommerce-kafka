import { products } from './productSeed';
import { Logger } from '../../../utils/logger/Logger';
import { productController } from '../controllers/productController';
import ProductModel from '../models/productModel';

export const runSeeder = async () => {
  try {
    const existingProducts = await ProductModel.find();
    if (existingProducts.length > 0) {
      Logger.info(`Seeder already ran, skipping...`);
      return;
    }

    Logger.info('Starting product seeder');
    for (const product of products) {
      try {
        await productController.createProductEvent(product);
      } catch (error) {
        Logger.error(`Error processing product: ${product.name}`, error);
      }
    }
    Logger.info('Product seeder completed successfully');
  } catch (error) {
    Logger.error('Error in seeder', error);
  }
};

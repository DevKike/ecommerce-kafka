import { saveProduct, findProductById } from "../services/productService";
import { products } from "./productSeed";
import { Logger } from "../../../utils/logger/Logger";

export const runSeeder = async () => {
  try {
    Logger.info("Starting product seeder");
    for (const product of products) {
      try {
        const existingProduct = await findProductById(product.id);
        if (existingProduct) {
          Logger.info(`Product already exists: ${product.name}`);
          continue;
        }

        await saveProduct(product);
      } catch (error) {
        Logger.error(`Error processing product: ${product.name}`, error);
      }
    }
    Logger.info("Product seeder completed successfully");
  } catch (error) {
    Logger.error("Error in seeder", error);
  }
};

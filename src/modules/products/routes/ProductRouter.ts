import { Router } from 'express';
import { injectable } from 'inversify';
import { ResponseManager } from '../../common/response/ResponseManager';
import { productController } from '../controllers/productController';
import { HttpStatusCode } from '../../../core/enums/HttpStatusCode';

@injectable()
export class ProductRouter {
  private readonly router: Router;
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/', async (req, res) => {
      await ResponseManager.manageResponse(
        productController.getAllProducts(),
        res,
        'Products fetched successfully',
        HttpStatusCode.OK
      );
    });
  }

  getRouter() {
    return this.router;
  }
}

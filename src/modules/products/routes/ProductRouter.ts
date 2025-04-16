import { Router } from 'express';
import { injectable } from 'inversify';
import { ResponseManager } from '../../common/response/ResponseManager';
import { createProductEvent, productController } from '../controllers/productController';
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

    this.router.post('/', async (req, res) => {
      await ResponseManager.manageResponse(
        createProductEvent(req.body),
        res,
        'Product created successfully',
        HttpStatusCode.CREATED
      );
    });
  }

  getRouter() {
    return this.router;
  }
}

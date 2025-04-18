import { Router } from 'express';
import { injectable } from 'inversify';
import { verifyAuthMiddleware } from '../../../middleware/verifyAuthMiddleware';
import { ResponseManager } from '../../common/express/response/ResponseManager';
import { factureController } from '../controllers/factureController';
import { HttpStatusCode } from '../../../core/enums/HttpStatusCode';

@injectable()
export class FactureRouter {
  private readonly router: Router;
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/', verifyAuthMiddleware(), async (req, res) => {
      await ResponseManager.manageResponse(
        factureController.createFactureEvent(req.body),
        res,
        'Facture event created successfully',
        HttpStatusCode.OK
      );
    });
  }
  getRouter() {
    return this.router;
  }
}

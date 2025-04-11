import { Router } from 'express';
import { saveUser } from '../controllers/userController';
import { injectable } from 'inversify';
import { middlewareSchema } from '../../../middleware/middlewareSchema';
import { userSchema } from '../schemas/userSchema';
import { HttpStatusCode } from '../../common/enums/HttpStatusCode';

@injectable()
export class UserRouter {
  private readonly router: Router;
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      '/register',
      middlewareSchema(userSchema),
      async (req, res) => {
        try {
          await saveUser(req.body);
          res
            .status(HttpStatusCode.CREATED)
            .json({ message: 'User created successfully' });
        } catch (error) {
          res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error creating user', error });
        }
      }
    );
  }

  getRouter() {
    return this.router;
  }
}

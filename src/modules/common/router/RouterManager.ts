import { Application } from 'express';
import { UserRouter } from '../../auth/routes/UserRouter';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/inversify/types/inversifyTypes';

@injectable()
export class RouterManager {
  constructor(
    @inject(TYPES.UserRouter) private readonly userRouter: UserRouter
  ) {}

  manageRoutes(app: Application): void {
    app.use('/api/users', this.userRouter.getRouter());
  }
}

import { Application } from 'express';
import { UserRouter } from '../../users/routes/UserRouter';
import { inject, injectable } from 'inversify';
import { TYPES } from '../inversify/types/inversifyTypes';
import { Logger } from '../../../utils/logger/Logger';

@injectable()
export class RouterManager {
  constructor(
    @inject(TYPES.UserRouter) private readonly userRouter: UserRouter
  ) {}

  manageRoutes(app: Application): void {
    app.use('/api/users', this.userRouter.getRouter());
  }
}

import { Router } from 'express';
import { saveUser } from '../controllers/UserController';
import { injectable } from 'inversify';

@injectable()
export class UserRouter {
  private readonly router: Router;
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/register', async (req, res) => {
      try {
        await saveUser(req.body);
        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
      }
    });
  }

  getRouter() {
    return this.router;
  }
}

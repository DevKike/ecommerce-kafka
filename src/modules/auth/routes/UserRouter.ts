import { Router } from "express";
import { loginUser, registerUser } from "../controllers/userController";
import { injectable } from "inversify";
import { middlewareSchema } from "../../../middleware/middlewareSchema";
import { loginSchema, userSchema } from "../schemas/userSchema";
import { HttpStatusCode } from "../../../core/enums/HttpStatusCode";
import { ResponseManager } from "../../common/response/ResponseManager";

@injectable()
export class UserRouter {
  private readonly router: Router;
  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post(
      "/register",
      middlewareSchema(userSchema),
      async (req, res) => {
        ResponseManager.manageResponse(
          await registerUser(req.body),
          res,
          "User registered with success!",
          HttpStatusCode.CREATED
        );
      }
    );

    this.router.post(
      "/login",
      middlewareSchema(loginSchema),
      async (req, res) => {
        ResponseManager.manageResponse(
          await loginUser(req.body),
          res,
          "Logued with success!",
          HttpStatusCode.OK
        );
      }
    );
  }

  getRouter() {
    return this.router;
  }
}

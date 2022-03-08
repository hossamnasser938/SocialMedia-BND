import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation";
import UsersController from "./users.controller";
import { signinSchema, signupSchema, verifySchema } from "./users.schema";

const router = new Router();

router
  .route("/signup")
  .post(validationMiddleware(signupSchema), UsersController.signup);

router
  .route("/signin")
  .post(validationMiddleware(signinSchema), UsersController.signin);

router
  .route("/verify")
  .post(validationMiddleware(verifySchema), UsersController.verify);

export default router;

import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication";
import { validationMiddleware } from "../../middlewares/validation";
import UsersController from "./users.controller";
import {
  resetPasswordSchema,
  signinSchema,
  signupSchema,
  verifySchema,
} from "./users.schema";

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

router
  .route("/reset-password")
  .post(
    validationMiddleware(resetPasswordSchema),
    authenticationMiddleware,
    UsersController.resetPassword
  );

export default router;

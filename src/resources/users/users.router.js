import { Router } from "express";
import { authenticationMiddleware } from "../../middlewares/authentication";
import { validationMiddleware } from "../../middlewares/validation";
import UsersController from "./users.controller";
import {
  forgetPasswordSchema,
  forgetPasswordUpdateSchema,
  forgetPasswordVerifySchema,
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

router
  .route("/forget-password")
  .post(
    validationMiddleware(forgetPasswordSchema),
    UsersController.forgetPassword
  );

router
  .route("/forget-password-verify")
  .post(
    validationMiddleware(forgetPasswordVerifySchema),
    UsersController.forgetPasswordVerify
  );

router
  .route("/forget-password-update")
  .post(
    validationMiddleware(forgetPasswordUpdateSchema),
    UsersController.forgetPasswordUpdate
  );

export default router;

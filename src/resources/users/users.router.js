import { Router } from "express";
import UsersController from "./users.controller";

const router = new Router();

router.route("/signup").post(UsersController.signup);
router.route("/signin").post(UsersController.signin);

export default router;

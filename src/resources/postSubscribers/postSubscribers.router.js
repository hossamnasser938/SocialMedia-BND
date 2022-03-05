import { Router } from "express";
import PostSubscribersController from "./postSubscriber.controller";

const router = new Router();

router.route("/unsubscribe").post(PostSubscribersController.unsubscribe);

export default router;

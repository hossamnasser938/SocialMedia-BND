import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation";
import PostSubscribersController from "./postSubscriber.controller";
import { unsubscribePostSchema } from "./postSubscribers.schema";

const router = new Router();

router
  .route("/unsubscribe")
  .post(
    validationMiddleware(unsubscribePostSchema),
    PostSubscribersController.unsubscribe
  );

export default router;

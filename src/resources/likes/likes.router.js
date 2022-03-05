import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation";
import LikesController from "./likes.controller";
import { likeUnlikePostSchema } from "./likes.schema";

const router = new Router();

router.route("/").get(LikesController.getPostLikes);
router
  .route("/like")
  .post(validationMiddleware(likeUnlikePostSchema), LikesController.likePost);
router
  .route("/unlike")
  .post(validationMiddleware(likeUnlikePostSchema), LikesController.unlikePost);

export default router;

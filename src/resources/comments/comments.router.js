import { Router } from "express";
import CommentsController from "./comments.controller";

const router = new Router();

router
  .route("/")
  .get(CommentsController.getPostComments)
  .post(CommentsController.createComment);

router.route("/:id").get(CommentsController.getComment);

export default router;

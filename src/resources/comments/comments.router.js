import { Router } from "express";
import CommentsController from "./comments.controller";
import { validationMiddleware } from "../../middlewares/validation";
import { createCommentSchema } from "./comments.schema";

const router = new Router();

router
  .route("/")
  .get(CommentsController.getPostComments)
  .post(
    validationMiddleware(createCommentSchema),
    CommentsController.createComment
  );

router.route("/:id").get(CommentsController.getComment);

export default router;

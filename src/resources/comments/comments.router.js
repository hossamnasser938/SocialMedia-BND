import { Router } from "express";
import CommentsController from "./comments.controller";
import { validationMiddleware } from "../../middlewares/validation";
import {
  createCommentSchema,
  getCommentSchema,
  getPostCommentsSchema,
} from "./comments.schema";

const router = new Router();

router
  .route("/")
  .get(
    validationMiddleware(getPostCommentsSchema),
    CommentsController.getPostComments
  )
  .post(
    validationMiddleware(createCommentSchema),
    CommentsController.createComment
  );

router
  .route("/:id")
  .get(validationMiddleware(getCommentSchema), CommentsController.getComment);

export default router;

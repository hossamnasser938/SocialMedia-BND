import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation";
import PostsController from "./posts.controller";
import {
  createPostSchema,
  getPostSchema,
  getPostsSchema,
} from "./posts.schema";

const router = new Router();

router
  .route("/")
  .get(validationMiddleware(getPostsSchema), PostsController.getPosts)
  .post(validationMiddleware(createPostSchema), PostsController.createPost);

router
  .route("/:id")
  .get(validationMiddleware(getPostSchema), PostsController.getPost);

export default router;

import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation";
import PostsController from "./posts.controller";
import { createPostSchema } from "./posts.schema";

const router = new Router();

router
  .route("/")
  .get(PostsController.getPosts)
  .post(validationMiddleware(createPostSchema), PostsController.createPost);

router.route("/:id").get(PostsController.getPost);

export default router;

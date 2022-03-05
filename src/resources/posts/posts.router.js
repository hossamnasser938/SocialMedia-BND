import { Router } from "express";
import PostsController from "./posts.controller";

const router = new Router();

router
  .route("/")
  .get(PostsController.getPosts)
  .post(PostsController.createPost);

router.route("/:id").get(PostsController.getPost);

export default router;

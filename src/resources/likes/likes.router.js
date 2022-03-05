import { Router } from "express";
import LikesController from "./likes.controller";

const router = new Router();

router.route("/").get(LikesController.getPostLikes);
router.route("/like").post(LikesController.likePost);
router.route("/unlike").post(LikesController.unlikePost);

export default router;

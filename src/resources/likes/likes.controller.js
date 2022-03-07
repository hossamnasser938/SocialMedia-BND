import {
  sendConditionalSuccessResult,
  sendSuccessResponse,
  sendUnexpectedResponse,
} from "../../utils/helpers";
import LikesDAO from "./likes.dao";
import PostSubscribersDAO from "../postSubscribers/postSubscribers.dao";
import { fork } from "child_process";

export default class LikesController {
  static async likePost(req, res) {
    const { postId } = req.body;
    const { user } = res.locals;

    try {
      await PostSubscribersDAO.subscribe(postId, user._id);
    } catch (err) {
      console.log("failed to subscribe a post", err);
    }

    const notifyPostSubscribersProcess = fork(
      "./src/services/notifyPostSubscribers.js"
    );
    notifyPostSubscribersProcess.send({
      authUser: user,
      postId,
      reaction: "like",
    });

    try {
      const { success, error } = await LikesDAO.likePost(postId, user._id);
      sendConditionalSuccessResult(res, success, error);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }

  static async unlikePost(req, res) {
    const { postId } = req.body;
    const { user } = res.locals;

    try {
      await PostSubscribersDAO.unsubscribe(postId, user._id);
    } catch (err) {
      console.log("failed to unsubscribe a post", err);
    }

    try {
      const success = await LikesDAO.unlikePost(postId, user._id);
      sendConditionalSuccessResult(res, success);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }

  static async getPostLikes(req, res) {
    const { post_id, page } = req.query;

    try {
      const likes = await LikesDAO.getPostLikes(post_id, page);
      sendSuccessResponse(res, "likes", likes);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }
}

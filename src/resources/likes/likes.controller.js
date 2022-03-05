import {
  sendConditionalSuccessResult,
  sendSuccessResponse,
  sendUnexpectedResponse,
} from "../../utils/helpers";
import LikesDAO from "./likes.dao";
import PostSubscribersDAO from "../postSubscribers/postSubscribers.dao";
import { notifyPostSubscribers } from "../../services/notifyPostSubscribers";

export default class LikesController {
  static async likePost(req, res) {
    const { postId } = req.body;
    const { user } = res.locals;

    try {
      await PostSubscribersDAO.subscribe(postId, user._id);
    } catch (err) {
      console.log("failed to subscribe a post", err);
    }

    try {
      await notifyPostSubscribers(user, postId, "like");
    } catch (err) {
      console.log("failed to notify post subscribers", err);
    }

    try {
      const success = await LikesDAO.likePost(postId, user._id);
      sendConditionalSuccessResult(res, success);
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
    const { postId, page } = req.query;

    try {
      const likes = await LikesDAO.getPostLikes(postId, page);
      sendSuccessResponse(res, "likes", likes);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }
}

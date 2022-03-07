import {
  sendConditionalSuccessResult,
  sendSuccessResponse,
  sendUnexpectedResponse,
} from "../../utils/helpers";
import CommentsDAO from "./comments.dao";
import PostSubscribersDAO from "../postSubscribers/postSubscribers.dao";
import { fork } from "child_process";

export default class CommentsController {
  static async createComment(req, res) {
    const { text, postId } = req.body;
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
      reaction: "comment",
    });

    try {
      const success = await CommentsDAO.createComment(text, user._id, postId);
      sendConditionalSuccessResult(res, success);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }

  static async getComment(req, res) {
    const { id } = req.params;

    try {
      const comment = await CommentsDAO.getComment(id);
      sendSuccessResponse(res, "comment", comment);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }

  static async getPostComments(req, res) {
    const { post_id, page } = req.query;

    try {
      const postComments = await CommentsDAO.getPostComments(post_id, page);
      sendSuccessResponse(res, "comments", postComments);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }
}

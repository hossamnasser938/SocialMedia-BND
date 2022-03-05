import {
  sendConditionalSuccessResult,
  sendSuccessResponse,
  sendUnexpectedResponse,
} from "../../utils/helpers";
import PostSubscribersDAO from "../postSubscribers/postSubscribers.dao";
import PostsDAO from "./posts.dao";

export default class PostsController {
  static async createPost(req, res) {
    const { text } = req.body;
    const { user } = res.locals;

    try {
      const { success, postId } = await PostsDAO.createPost(text, user._id);

      if (success && postId) {
        try {
          await PostSubscribersDAO.subscribe(postId, user._id);
        } catch (err) {
          console.log("failed to subscribe a post", err);
        }
      }

      sendConditionalSuccessResult(res, success);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }

  static async getPosts(req, res) {
    const { page, user_id } = req.query;
    const { user } = res.locals;

    try {
      const posts = await PostsDAO.getPosts(user._id, user_id, page);
      sendSuccessResponse(res, "posts", posts);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }

  static async getPost(req, res) {
    const { id } = req.params;
    const { user } = res.locals;

    try {
      const post = await PostsDAO.getPost(id, user._id);
      sendSuccessResponse(res, "post", post);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }
}

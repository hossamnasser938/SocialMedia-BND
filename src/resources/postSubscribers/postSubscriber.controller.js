import PostSubscribersDAO from "./postSubscribers.dao";
import {
  sendConditionalSuccessResult,
  sendUnexpectedResponse,
} from "../../utils/helpers";

export default class PostSubscribersController {
  static async unsubscribe(req, res) {
    const { postId } = req.query;
    const { user } = res.locals;

    try {
      const success = await PostSubscribersDAO.unsubscribe(postId, user._id);
      sendConditionalSuccessResult(res, success);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }
}

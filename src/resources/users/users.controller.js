import {
  comparePlaintextCiphertext,
  sendUserNotFound,
  sendSuccessResponse,
  sendNotFoundResponse,
  sendUnexpectedResponse,
  sendConditionalSuccessResult,
  sendFailureResponse,
} from "../../utils/helpers";
import UsersDAO from "./users.dao";
import { createToken } from "../../middlewares/authentication";
import { encrypt } from "../../utils/helpers";

export default class UsersController {
  static async signup(req, res) {
    try {
      const { email, password } = req.body;
      const encryptedPassword = encrypt(password);
      const success = await UsersDAO.createUser(email, encryptedPassword);
      sendConditionalSuccessResult(res, success);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }

  static async signin(req, res) {
    try {
      const { email, password } = req.body;
      const document = await UsersDAO.getUserByEmail(email);
      if (!document) {
        sendUserNotFound(res);
        return;
      }

      const isPasswordMatch = comparePlaintextCiphertext(
        password,
        document.password
      );

      if (!isPasswordMatch) {
        sendUserNotFound(res);
        return;
      }

      const user = { ...document };
      delete user.password;

      if (!user.verified) {
        sendFailureResponse(res, ["user"], [user]);
        return;
      }

      const token = createToken(document._id);
      if (document) {
        sendSuccessResponse(res, ["user", "token"], [user, token]);
      } else {
        sendNotFoundResponse(res, document);
      }
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }
}

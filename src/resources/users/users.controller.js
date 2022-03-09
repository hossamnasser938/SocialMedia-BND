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
import OtpsDAO from "../otps/otps.dao";
import { sendEmail } from "../../services/sendEmail";
import { generateRandomVerificationCode } from "../otps/otps.utils";

export default class UsersController {
  static async signup(req, res) {
    try {
      const { email, password } = req.body;
      const encryptedPassword = encrypt(password);
      const { success, userId } = await UsersDAO.createUser(
        email,
        encryptedPassword
      );
      if (success) {
        const code = generateRandomVerificationCode();
        const successInsertingOtp = await OtpsDAO.insertOtp(userId, code);
        if (successInsertingOtp) {
          await sendEmail(
            "Verification",
            `Use code: ${code} to verify your email`,
            email
          );
          sendSuccessResponse(res);
        } else {
          sendFailureResponse(res);
        }
      } else {
        sendFailureResponse(res);
      }
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

  static async verify(req, res) {
    const { userId, code } = req.body;

    try {
      const result = await OtpsDAO.getOtp(userId, code);
      if (result) {
        const success = await UsersDAO.updateUser(userId, { verified: true });
        sendConditionalSuccessResult(res, success);
      } else {
        sendFailureResponse(res, ["error"], ["Incorrect code"]);
      }
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }
}

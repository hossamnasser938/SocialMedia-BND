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
import OtpsDAO from "../otps/otps.dao";
import { createToken } from "../../middlewares/authentication";
import { encrypt } from "../../utils/helpers";
import { sendEmail } from "../../services/sendEmail";
import { generateRandomVerificationCode } from "../otps/otps.utils";
import { isCodeExpired } from "./users.utils";

export default class UsersController {
  static async signup(req, res) {
    const { email, password } = req.body;

    try {
      const encryptedPassword = encrypt(password);

      const { success, userId } = await UsersDAO.createUser(
        email,
        encryptedPassword
      );

      if (!success) {
        sendFailureResponse(res);
        return;
      }

      const code = generateRandomVerificationCode();
      const successInsertingOtp = await OtpsDAO.insertOtp(userId, code);

      if (!successInsertingOtp) {
        sendFailureResponse(res);
        return;
      }

      await sendEmail(
        "Verification",
        `Use code: ${code} to verify your email`,
        email
      );
      sendSuccessResponse(res, "userId", userId);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }

  static async signin(req, res) {
    const { email, password } = req.body;

    try {
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
      const otpDoc = await OtpsDAO.getOtp(userId, code);

      if (!otpDoc) {
        sendFailureResponse(res, "error", "Incorrect code");
        return;
      }

      if (isCodeExpired(otpDoc.createdAt)) {
        sendFailureResponse(res, ["error"], ["Code expired"]);
        return;
      }

      const success = await UsersDAO.updateUser(userId, { verified: true });
      sendConditionalSuccessResult(res, success);
    } catch (err) {
      sendUnexpectedResponse(res, err);
    }
  }

  static async resetPassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const { user } = res.locals;

    try {
      if (!comparePlaintextCiphertext(oldPassword, user.password)) {
        sendFailureResponse(res, "error", "Incorrct old password");
        return;
      }

      const encryptedNewPassword = encrypt(newPassword);
      const success = await UsersDAO.updateUser(user._id, {
        password: encryptedNewPassword,
      });

      sendConditionalSuccessResult(res, success);
    } catch (err) {
      sendUnexpectedResponse(res);
    }
  }

  static async forgetPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await UsersDAO.getUserByEmail(email);
      if (!user) {
        sendFailureResponse(res, "error", "User not found");
        return;
      }

      const code = generateRandomVerificationCode();
      const successInsertingOtp = await OtpsDAO.insertOtp(user._id, code);

      if (!successInsertingOtp) {
        sendUnexpectedResponse(res);
        return;
      }

      await sendEmail(
        "Verification",
        `Use code: ${code} to complete forget password steps`,
        email
      );

      sendSuccessResponse(res);
    } catch (err) {
      sendUnexpectedResponse(res);
    }
  }

  static async forgetPasswordVerify(req, res) {
    const { email, code } = req.body;

    try {
      const user = await UsersDAO.getUserByEmail(email);
      if (!user) {
        sendFailureResponse(res, "error", "User not found");
        return;
      }

      const otpDoc = await OtpsDAO.getOtp(user._id, code);
      if (!otpDoc) {
        sendFailureResponse(res, "error", "Incorrect code");
        return;
      }

      if (isCodeExpired(otpDoc.createdAt)) {
        sendFailureResponse(res, ["error"], ["Code expired"]);
        return;
      }

      sendSuccessResponse(res);
    } catch (err) {
      sendUnexpectedResponse(res);
    }
  }

  static async forgetPasswordUpdate(req, res) {
    const { email, code, newPassword } = req.body;

    try {
      const user = await UsersDAO.getUserByEmail(email);
      if (!user) {
        sendFailureResponse(res, "error", "User not found");
        return;
      }

      const otpDoc = await OtpsDAO.getOtp(user._id, code);
      if (!otpDoc) {
        sendFailureResponse(res, "error", "Incorrect code");
        return;
      }

      if (isCodeExpired(otpDoc.createdAt)) {
        sendFailureResponse(res, ["error"], ["Code expired"]);
        return;
      }

      const encryptedNewPassword = encrypt(newPassword);
      const success = await UsersDAO.updateUser(user._id, {
        password: encryptedNewPassword,
      });

      sendConditionalSuccessResult(res, success);
    } catch (err) {
      sendUnexpectedResponse(res);
    }
  }
}

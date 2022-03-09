import { sign, verify } from "jsonwebtoken";
import UsersDAO from "../resources/users/users.dao";
import { sendUnauthenticated, sendUnexpectedResponse } from "../utils/helpers";

export const createToken = (userId) => {
  return sign({ userId }, process.env.AUTH_SECRET);
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    verify(token, process.env.AUTH_SECRET, (err, payload) => {
      if (err) return reject(err);
      resolve(payload.userId);
    });
  });
};

export const authenticationMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  const token =
    authorization && authorization.split(process.env.TOKEN_TYPE + " ")[1];

  try {
    const userId = await verifyToken(token);
    if (!userId) {
      sendUnexpectedResponse(res, userId);
      return;
    }

    const user = await UsersDAO.getUserById(userId);
    if (!user) {
      sendUnauthenticated(res, user);
      return;
    }

    res.locals.user = user;
    return next();
  } catch (err) {
    sendUnauthenticated(res, err);
  }
};

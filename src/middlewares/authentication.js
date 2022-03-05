import { sign, verify } from "jsonwebtoken";
import UsersDAO from "../resources/users/users.dao";
import { AUTH_SECRET, TOKEN_TYPE } from "../utils/constants";
import { sendUnauthenticated, sendUnexpectedResponse } from "../utils/helpers";

export const createToken = (userId) => {
  return sign({ userId }, AUTH_SECRET);
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    verify(token, AUTH_SECRET, (err, payload) => {
      if (err) return reject(err);
      resolve(payload.userId);
    });
  });
};

export const authenticationMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(TOKEN_TYPE + " ")[1];
  try {
    const userId = await verifyToken(token);
    if (userId) {
      const user = await UsersDAO.getUserById(userId);
      if (user) {
        res.locals.user = user;
        return next();
      }
      sendUnauthenticated(res, user);
    } else {
      sendUnexpectedResponse(res, userId);
    }
  } catch (err) {
    sendUnauthenticated(res, err);
  }
};

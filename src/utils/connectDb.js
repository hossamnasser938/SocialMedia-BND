import { MongoClient } from "mongodb";
import UsersDAO from "../resources/users/users.dao";
import PostsDAO from "../resources/posts/posts.dao";
import CommentsDAO from "../resources/comments/comments.dao";
import LikesDAO from "../resources/likes/likes.dao";
import PostSubscribersDAO from "../resources/postSubscribers/postSubscribers.dao";
import OtpsDAO from "../resources/otps/otps.dao";

export const connectDB = async () => {
  return new Promise((res, rej) => {
    MongoClient.connect(process.env.DB_URI)
      .then(async (client) => {
        try {
          await UsersDAO.injectDB(client);
          await PostsDAO.injectDB(client);
          await CommentsDAO.injectDB(client);
          await LikesDAO.injectDB(client);
          await PostSubscribersDAO.injectDB(client);
          await OtpsDAO.injectDB(client);

          res(client);
        } catch (err) {
          console.log("error injecting some dao", err);
          rej();
        }
      })
      .catch((err) => {
        console.log("error connecting to db", err);
        rej();
      });
  });
};

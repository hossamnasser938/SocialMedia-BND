import dotenv from "dotenv";
import { MongoClient } from "mongodb";

import UsersDAO from "../resources/users/users.dao";
import PostsDAO from "../resources/posts/posts.dao";
import CommentsDAO from "../resources/comments/comments.dao";
import LikesDAO from "../resources/likes/likes.dao";
import PostSubscribersDAO from "../resources/postSubscribers/postSubscribers.dao";
import { sendEmail } from "./sendEmail";

// reaction = like | comment;

const getNotificationMessage = (authUser, userEmail, post, reaction) => {
  let action, targetPost;
  switch (reaction) {
    case "like":
      action = "liked";
      break;
    case "comment":
      action = "commented on";
      break;
    default:
      throw new Error("reaction not like nor comment");
  }

  if (post.createdUser.email === userEmail) targetPost = "your post";
  else targetPost = "a post you subscribed to";

  return `${authUser.email} ${action} ${targetPost}`;
};

export const notifyPostSubscribers = async (authUser, postId, reaction) => {
  const postSubscribers = await PostSubscribersDAO.getPostSubscribers(postId);
  const subscribersEmailArray = postSubscribers.map(
    (postSubscriber) => postSubscriber.email
  );
  const subscribersEmailArrayNoAuthUser = subscribersEmailArray.filter(
    (subscriberEmail) => subscriberEmail !== authUser.email
  );

  const post = await PostsDAO.getPost(postId, authUser._id);

  subscribersEmailArrayNoAuthUser.forEach((email) => {
    const subject = "Post reaction";
    const message = getNotificationMessage(authUser, email, post, reaction);

    sendEmail(subject, message, email).catch((err) => {
      console.log("failed to send email", err);
    });
  });
};

process.on("message", async (message) => {
  const { authUser, postId, reaction } = message;

  if (authUser && postId && reaction) {
    dotenv.config();

    try {
      MongoClient.connect(process.env.DB_URI)
        .then(async (client) => {
          await UsersDAO.injectDB(client);
          await PostsDAO.injectDB(client);
          await CommentsDAO.injectDB(client);
          await LikesDAO.injectDB(client);
          await PostSubscribersDAO.injectDB(client);
          await notifyPostSubscribers(authUser, postId, reaction);
        })
        .catch((err) => {
          console.log("error connecting to db", err);
        });
    } catch (err) {
      console.log("failed to notify post subscribers", err);
    }
  } else {
    console.log(
      "received incorrectly formatted message to snotifyPostSubscribers",
      message
    );
  }
});

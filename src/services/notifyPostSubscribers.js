import PostsDAO from "../resources/posts/posts.dao";
import PostSubscribersDAO from "../resources/postSubscribers/postSubscribers.dao";
import { sendEmail } from "./sendEmail";
import { prepareServer } from "../utils/prepareServer";

// reaction = like | comment;

const getNotificationMessage = (authUser, userEmail, post, reaction) => {
  let action;
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

  const targetPost =
    post.createdUser.email === userEmail
      ? "your post"
      : "a post you subscribed to";

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
    prepareServer()
      .then(async (dbConnection) => {
        try {
          await notifyPostSubscribers(authUser, postId, reaction);
        } catch (err) {
          console.log("failed to notify post subscribers", err);
        }
      })
      .catch((err) => {});
  } else {
    console.log(
      "received incorrectly formatted message to snotifyPostSubscribers",
      message
    );
  }
});

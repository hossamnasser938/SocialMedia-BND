import PostSubscribersDAO from "../resources/postSubscribers/postSubscribers.dao";
import PostsDAO from "../resources/posts/posts.dao";
import { sendEmail } from "./sendEmail";

// reaction = like | comment;

const getNotificationMessage = (authUser, userEmail, post, reaction) => {
  console.log("authUser, post", authUser, post);
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

    sendEmail(subject, message, email);
  });
};

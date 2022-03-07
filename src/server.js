import http from "http";
import express from "express";
import UsersRouter from "./resources/users/users.router";
import PostsRouter from "./resources/posts/posts.router";
import CommentsRouter from "./resources/comments/comments.router";
import LikesRouter from "./resources/likes/likes.router";
import PostSubscribersRouter from "./resources/postSubscribers/postSubscribers.router";
import { authenticationMiddleware } from "./middlewares/authentication";
import { prepareServer } from "./utils/prepareServer";

const app = express();

app.use(express.json());

app.use("/users", UsersRouter);

app.use(authenticationMiddleware);

app.use("/posts", PostsRouter);
app.use("/comments", CommentsRouter);
app.use("/likes", LikesRouter);
app.use("/postSubscribers", PostSubscribersRouter);

const server = http.createServer(app);

prepareServer()
  .then((dbConnection) => {
    server.listen(process.env.PORT, () =>
      console.log(`server is listening on ${process.env.PORT}`)
    );
  })
  .catch((err) => {});

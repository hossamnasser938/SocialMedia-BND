import http from "http";
import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import UsersDAO from "./resources/users/users.dao";
import PostsDAO from "./resources/posts/posts.dao";
import CommentsDAO from "./resources/comments/comments.dao";
import UsersRouter from "./resources/users/users.router";
import PostsRouter from "./resources/posts/posts.router";
import CommentsRouter from "./resources/comments/comments.router";
import LikesRouter from "./resources/likes/likes.router";
import PostSubscribersRouter from "./resources/postSubscribers/postSubscribers.router";
import { authenticationMiddleware } from "./middlewares/authentication";
import LikesDAO from "./resources/likes/likes.dao";
import PostSubscribersDAO from "./resources/postSubscribers/postSubscribers.dao";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/users", UsersRouter);

app.use(authenticationMiddleware);

app.use("/posts", PostsRouter);
app.use("/comments", CommentsRouter);
app.use("/likes", LikesRouter);
app.use("/postSubscribers", PostSubscribersRouter);

const server = http.createServer(app);

MongoClient.connect(process.env.DB_URI)
  .then(async (client) => {
    await UsersDAO.injectDB(client);
    await PostsDAO.injectDB(client);
    await CommentsDAO.injectDB(client);
    await LikesDAO.injectDB(client);
    await PostSubscribersDAO.injectDB(client);

    server.listen(process.env.PORT, () =>
      console.log(`server is listening on ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.log("error connecting to db", err);
  });

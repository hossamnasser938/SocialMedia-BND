import Joi from "joi";
Joi.objectID = require("joi-objectid")(Joi);

export const createCommentSchema = Joi.object({
  text: Joi.string().required(),
  postId: Joi.objectID().required(),
});

export const getPostCommentsSchema = Joi.object({
  page: Joi.number(),
  post_id: Joi.objectID().required(),
});

export const getCommentSchema = Joi.object({ id: Joi.objectID() });

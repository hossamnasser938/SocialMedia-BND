import Joi from "joi";
Joi.objectID = require("joi-objectid")(Joi);

export const createPostSchema = Joi.object({ text: Joi.string().required() });

export const getPostsSchema = Joi.object({
  page: Joi.number(),
  user_id: Joi.objectID(),
});

export const getPostSchema = Joi.object({ id: Joi.objectID().required() });

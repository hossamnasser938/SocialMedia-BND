import Joi from "joi";
Joi.objectID = require("joi-objectid")(Joi);

export const createCommentSchema = Joi.object({
  text: Joi.string().required(),
  postId: Joi.objectID(),
});

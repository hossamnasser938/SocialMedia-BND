import Joi from "joi";
Joi.objectId = require("joi-objectid")(Joi);

export const createCommentSchema = Joi.object({
  text: Joi.string().required(),
  postId: Joi.objectId(),
});

import Joi from "joi";
Joi.objectID = require("joi-objectid")(Joi);

export const likeUnlikePostSchema = Joi.object({ postId: Joi.objectID() });

export const getPostLikesSchema = Joi.object({
  page: Joi.number(),
  post_id: Joi.objectID(),
});

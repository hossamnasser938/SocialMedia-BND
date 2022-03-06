import Joi from "joi";
Joi.objectID = require("joi-objectid")(Joi);

export const unsubscribePostSchema = Joi.object({
  postId: Joi.objectID().required(),
});

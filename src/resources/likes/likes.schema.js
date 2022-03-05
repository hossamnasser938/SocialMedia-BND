import Joi from "joi";
Joi.objectId = require("joi-objectid")(Joi);

export const likeUnlikePostSchema = Joi.object({ postId: Joi.objectId() });

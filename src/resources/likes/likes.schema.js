import Joi from "joi";
Joi.objectID = require("joi-objectid")(Joi);

export const likeUnlikePostSchema = Joi.object({ postId: Joi.objectID() });

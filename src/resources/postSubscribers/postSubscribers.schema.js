import Joi from "joi";
Joi.objectId = require("joi-objectid")(Joi);

export const unsubscribePostSchema = Joi.object({ postId: Joi.objectId() });

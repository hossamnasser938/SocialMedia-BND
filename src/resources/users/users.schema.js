import Joi from "joi";
Joi.objectID = require("joi-objectid")(Joi);

const emailSchema = Joi.string().email().required();
const passwordSchema = Joi.string().min(8).required();

export const signinSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

export const verifySchema = Joi.object({
  userId: Joi.objectID().required(),
  code: Joi.string().required(),
});

export const resetPasswordSchema = Joi.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

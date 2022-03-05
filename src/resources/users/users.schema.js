import Joi from "joi";

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

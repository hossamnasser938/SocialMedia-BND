import Joi from "joi";
Joi.objectID = require("joi-objectid")(Joi);
import {
  ONLY_NUMBERS_REGEX,
  OTP_LENGTH,
  PASSWORD_LENGTH,
} from "../../utils/constants";

const emailSchema = Joi.string().email().required();
const passwordSchema = Joi.string().min(PASSWORD_LENGTH).required();
const codeSchema = Joi.string()
  .length(OTP_LENGTH)
  .pattern(ONLY_NUMBERS_REGEX)
  .required();

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
  code: codeSchema,
});

export const resetPasswordSchema = Joi.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

export const forgetPasswordSchema = Joi.object({
  email: emailSchema,
});

export const forgetPasswordVerifySchema = Joi.object({
  email: emailSchema,
  code: codeSchema,
});

export const forgetPasswordUpdateSchema = Joi.object({
  email: emailSchema,
  code: codeSchema,
  newPassword: passwordSchema,
});

export const validationMiddleware = (schema) => async (req, res, next) => {
  const { error } = schema.validate(req.body);
  console.log("validation error", error);
  if (error)
    return res
      .status(400)
      .json({
        success: false,
        errors: error.details.map((details) => details.message),
      });

  next();
};

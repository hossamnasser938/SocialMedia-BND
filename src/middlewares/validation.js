const getSchemaInstanceFromRequest = (req) => {
  if (req.method === "GET" || req.method === "DELETE") {
    return { ...req.params, ...req.query };
  } else {
    return req.body;
  }
};

export const validationMiddleware = (schema) => async (req, res, next) => {
  const schemaInstance = getSchemaInstanceFromRequest(req);

  const { error } = schema.validate(schemaInstance);

  if (error) {
    // console.log("validation error, req, res", error, req, res);
    res.status(400).json({
      success: false,
      errors: error.details.map((details) => details.message),
    });
    return;
  }

  next();
};

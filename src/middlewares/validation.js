const getSchemaInstanceFromReuest = (req) => {
  if (req.method === "GET" || req.method === "DELETE") {
    return { ...req.params, ...req.query };
  } else {
    return req.body;
  }
};

export const validationMiddleware = (schema) => async (req, res, next) => {
  const schemaInstance = getSchemaInstanceFromReuest(req);
  console.log("schemaInstance", schemaInstance);

  const { error } = schema.validate(schemaInstance);

  if (error) {
    // console.log("validation error, req, res", error, req, res);
    return res.status(400).json({
      success: false,
      errors: error.details.map((details) => details.message),
    });
  }

  next();
};

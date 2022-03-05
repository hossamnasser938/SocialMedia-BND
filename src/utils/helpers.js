import bcrypt from "bcryptjs";

export const encrypt = (plaintext) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(plaintext, salt);
};

export const comparePlaintextCiphertext = (plaintext, ciphertext) => {
  return bcrypt.compareSync(plaintext, ciphertext);
};

function assignKeysVals(obj, keys, vals) {
  const newObj = { ...obj };

  if (Array.isArray(keys) && Array.isArray(vals)) {
    for (let i = 0; i < keys.length; i++) {
      newObj[keys[i]] = vals[i];
    }
  } else if (keys) {
    newObj[keys] = vals;
  }

  return newObj;
}

export const sendSuccessResponse = (res, keys, vals) => {
  const jsonObj = assignKeysVals({ success: true }, keys, vals);
  res.json(jsonObj);
};

export const sendFailureResponse = (res, keys, vals) => {
  const jsonObj = assignKeysVals({ success: false }, keys, vals);
  res.json(jsonObj);
};

export const sendConditionalSuccessResult = (res, success) => {
  res.json({ success });
};

export const sendNotFoundResponse = (res, errorOrResult) => {
  console.log("sendNotFoundResponse errorOrResult", errorOrResult);
  res.status(404).json({ success: false, message: "NOT_FOUND" });
};

export const sendUnexpectedResponse = (res, errorOrResult) => {
  console.log("sendUnexpectedResponse errorOrResult", errorOrResult);
  const message = !errorOrResult.errors
    ? "UNEXPECTED"
    : Object.values(errorOrResult.errors).map((error) => error.message);
  res.status(400).json({ success: false, message });
};

export const sendUnauthenticated = (res, errorOrResult) => {
  console.log("sendUnauthenticated errorOrResult", errorOrResult);
  res.status(403).json({ success: false, message: "UNAUTHENTICATED" });
};

export const sendUserNotFound = (res) => {
  sendFailureResponse(res, "message", "USER NOT FOUND");
};

const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

function hasValidRequest(req, next, msg, status) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(msg, status));
  }
  return true;
}

module.exports = hasValidRequest;

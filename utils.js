/* global require exports */
const { validationResult } = require("express-validator");

/**
 * Finds the validation errors in this request and wraps
 * @param {import('express').Request} request
 */
exports.validationResponse = (request) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const valErrors = errors.array().map((error) => ({
      message: error.msg,
      field: error.param,
      value: error.value,
    }));
    const error = new Error(
      "Request validation failed. Request body contains invalid values"
    );
    error.name = "ValidationError";
    error.validation_errors = valErrors;
    throw error;
  }

  return true;
};

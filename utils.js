/* global require exports */
const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

/**
 * Finds the validation errors in this request and wraps
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
exports.validationResponse = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const valErrors = errors.array().map((error) => ({
      message: error.msg,
      field: error.param,
      value: error.value,
    }));
    return response.status(StatusCodes.BAD_REQUEST).json({
      error: {
        name: "ValidationError",
        message:
          "Request validation failed. Request body contains invalid values",
        validation_errors: valErrors,
      },
    });
  }

  return true;
};

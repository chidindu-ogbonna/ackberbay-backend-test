/* global require exports */
const { createLogger, format, transports } = require("winston");
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

const loggerFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
});

/**
 * Creates a logger for the given type
 * @example
 * const { logger } = require("./utils");
 * logger.info("Hello world");
 * logger.error("Something went wrong");
 */
exports.logger = createLogger({
  format: format.combine(
    format.label({ label: "HackerBay Logs" }),
    format.timestamp(),
    loggerFormat
  ),

  transports: [
    new transports.Console(),
    new transports.File({
      filename: "combined.log",
    }),
  ],
});

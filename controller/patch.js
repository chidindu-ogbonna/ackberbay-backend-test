/* global require module */
const { body } = require("express-validator");
const jsonpatch = require("jsonpatch");
const { StatusCodes } = require("http-status-codes");
const { validationResponse, logger } = require("../utils");

/**
 * Apply Json Patch Request body should contain a JSON object and a JSON patch object
 * Apply the json patch to the json object, and return the resulting json object.
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
const patch = async (request, response) => {
  try {
    validationResponse(request);

    const { patch, json } = request.body;
    const patched_json = jsonpatch.apply_patch(json, patch);

    return response.status(StatusCodes.OK).json({ data: { patched_json } });
  } catch (error) {
    logger.error(error);
    if (error.name === "ValidationError") {
      return response.status(StatusCodes.BAD_REQUEST).json({
        error: {
          name: error.name,
          message: error.message,
          validation_errors: error.validation_errors,
        },
      });
    }

    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }
};

module.exports = patch;
module.exports.validators = [
  body("json").isObject().withMessage("JSON must be an object"),
  body("patch").isArray().withMessage("JSON patch must be an object"),
];

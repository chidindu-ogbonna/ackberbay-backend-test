/* global require module */
const { body } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const { validationResponse } = require("../utils");

/**
 * Thumbnail generator
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
const thumbnail = async (request, response) => {
  try {
    // validationResponse(request, response);
    console.log("Here: ", request.path);
    console.log("Request: ", request.body);

    return response
      .status(StatusCodes.OK)
      .json({ data: { user: request["user"], message: "succss" } });
  } catch (err) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: {
        name: err.name,
        message: err.message,
      },
    });
  }
};

module.exports = thumbnail;
module.exports.validators = [body("file").isString()];

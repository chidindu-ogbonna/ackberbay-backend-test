/* global require module process  */
const bcrypt = require("bcryptjs");
const { body } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { validationResponse, logger } = require("../utils");

/**
 * Login controller
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
const login = async (request, response) => {
  try {
    validationResponse(request, response);
    const { username, password } = request.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const token = jwt.sign(
      { username, password_hash: passwordHash },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    const issuedAt = new Date().getTime();
    const expiry = new Date(issuedAt + 2 * 60 * 60 * 1000).getTime();

    const user = {
      username,
      token,
      iat: issuedAt,
      exp: expiry,
    };
    return response.status(StatusCodes.OK).json({ data: { user } });
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

module.exports = login;
module.exports.validators = [
  body("username").isString().withMessage("username must be a string"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
];

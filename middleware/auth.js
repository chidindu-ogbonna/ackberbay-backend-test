/* global require module process */
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

/**
 * Verify token middleware
 * @example
 * const auth = require("middleware/auth");
 * app.post("/thumbnail", auth, controller);
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
const verifyToken = (request, response, next) => {
  try {
    const headers = request.headers;
    const authorization = headers["authorization"] || headers["Authorization"];

    if (!authorization) {
      return response.status(StatusCodes.UNAUTHORIZED).send({
        error: {
          name: "AuthError",
          message: "Unauthorized: No authorization header present",
        },
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return response.status(StatusCodes.FORBIDDEN).json({
        error: {
          name: "AuthError",
          message: "A token is required for authentication",
        },
      });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    request["user"] = decoded;
  } catch (err) {
    return response.status(StatusCodes.UNAUTHORIZED).json({
      error: {
        name: err.name,
        message: err.message,
      },
    });
  }
  return next();
};

module.exports = verifyToken;

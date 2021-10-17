/* global require module */
require("dotenv").config();
const express = require("express");
const auth = require("./middleware/auth");
const login = require("./controller/login");
const thumbnail = require("./controller/thumbnail");
const patch = require("./controller/patch");
const { StatusCodes } = require("http-status-codes");

const { validators: loginValidators } = login;
const { validators: thumbnailValidators } = thumbnail;
const { validators: patchValidators } = patch;

const app = express();

app.use(express.json({ limit: "50mb" }));

app.post("/login", ...loginValidators, login);

app.post("/thumbnail", auth, ...thumbnailValidators, thumbnail);

// app.post("/patch", auth, (request, response) => {
//   response.status(200).send("Welcome 🙌 ");
// });

app.get("/", (_, response) => {
  return response.status(StatusCodes.OK).json({
    data: {
      message: "Welcome 🙌",
    },
  });
});

app.use("*", (_, response) => {
  return response.status(StatusCodes.NOT_FOUND).json({
    error: {
      name: "NotFoundError",
      message: "You reached a route that is not defined on this server",
    },
  });
});

module.exports = app;

/* global require module */
require("dotenv").config();
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const auth = require("./middleware/auth");
const login = require("./controller/login");
const thumbnail = require("./controller/thumbnail");
const patch = require("./controller/patch");

const { validators: loginValidators } = login;
const { validators: thumbnailValidators } = thumbnail;
const { validators: patchValidators } = patch;

const app = express();

app.use(express.json({ limit: "50mb" }));

app.post("/login", ...loginValidators, login);

app.post("/thumbnail", auth, ...thumbnailValidators, thumbnail);

app.post("/patch", auth, ...patchValidators, patch);

app.use("*", (_, response) => {
  return response.status(StatusCodes.NOT_FOUND).json({
    error: {
      name: "NotFoundError",
      message: "You reached a route that is not defined on this server",
    },
  });
});

module.exports = app;

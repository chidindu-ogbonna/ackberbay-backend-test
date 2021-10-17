/* global require module */
const fs = require("fs");
const sharp = require("sharp");
const got = require("got");
const { promisify } = require("util");
const stream = require("stream");
const { body } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const { validationResponse } = require("../utils");

const pipeline = promisify(stream.pipeline);

/**
 * Generate thumbnail from a public image url.
 * Download the image, resize to 50x50 pixels, and return the resulting thumbnail.
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
const thumbnail = async (request, response) => {
  try {
    validationResponse(request);

    const { image_url } = request.body;

    const split = image_url.split(".");
    const ext = image_url.split(".")[split.length - 1];
    const randomString = (Math.random() + 1).toString(36).substring(2);

    const filename = `${randomString}.${ext}`;
    const fileLocation = `/tmp/${filename}`;
    const thumbnailLocation = `/tmp/${randomString}_thumbnail.${ext}`;

    await pipeline(got.stream(image_url), fs.createWriteStream(fileLocation));

    await sharp(fileLocation)
      .resize(50, 50)
      .jpeg({ mozjpeg: true })
      .toFile(thumbnailLocation);

    // TODO: Save in cloudinary

    // var fileName = req.params.name;
    return response.sendFile(thumbnailLocation);

    // response.sendFile(fileName, options, (err) => {
    //   if (err) {
    //     next(err);
    //   } else {
    //     console.log("Sent:", fileName);
    //   }
    // });

    // return response.status(StatusCodes.OK).json({
    //   data: {
    //     filename: `${randomString}_thumbnail.${ext}`,
    //   },
    // });
  } catch (error) {
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

module.exports = thumbnail;
module.exports.validators = [
  body("image_url").isString().withMessage("image url must be a string"),
  body("image_url").isURL().withMessage("image url must be an actual url"),
];

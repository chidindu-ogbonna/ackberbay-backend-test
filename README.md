# Hacker Bay

## Overview

Project done as a requirement for the hackerbay backend test.

A simple stateless microservice in Nodejs, with three major functionalities -

- Authentication
- JSON patching
- Image Thumbnail Generation

It contains 3 endpoints which fulfills the requirments listed above.

1 public endpoint and 2 protected endpoints that require authentication in the form of a **Bearer Token** authorization.

- `POST /login`

  Login Request body recieves an arbitrary username/password pair.
  Return a signed [JSON Web Token](https://jwt.io/) which can be used to validate future requests.

- `POST /patch`

  A protected endpoint. The JWT obtained in the “Login” must be sent in the Authorization header.

  If the JWT is missing or invalid, it rejects the request
  This endpoints applies a [JSON Patch](http://jsonpatch.com) to a JSON object. The Request body should recieves a JSON object and a JSON patch object. It applies the json patch to the json object, and return the resulting json object.

- `POST /thumbnail`

  Also a protected endpoint, and follows the same authorization as the `/patch` endpoint.

  It recieves a public image URL in the request. Downloads the image, resizes to 50x50 pixels, and returns the resulting thumbnail.

## Setup

To get started

Rename the `.env.example` file to `.env.dev`, then fill in your env variables

### Run Application

`npm run dev`

### Tests

`npm test`

Generates coverage report in `coverage/`

### Linting

`npm run lint`

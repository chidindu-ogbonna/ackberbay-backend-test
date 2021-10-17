/* global describe require it before process */
const chai = require("chai");
const chaiHttp = require("chai-http");
const bcrypt = require("bcryptjs");
const jiff = require("jiff");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const app = require("../app");
const faker = require("faker");

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

const signJWT = async ({ username, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const token = jwt.sign(
    { username, password_hash: passwordHash },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );
  return token;
};

describe("Patch", () => {
  let token;

  before(async () => {
    token = await signJWT({ username: "admin", password: "new-password" });
  });

  describe("POST /patch", () => {
    it("should return a patched json response", (done) => {
      const json = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const new_json = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        address: faker.address.streetAddress(),
      };

      // Generate diff (ie JSON Patch) from a to b
      const patch = jiff.diff(json, new_json);

      const reqBody = { patch, json };
      chai
        .request(app)
        .post("/patch")
        .set("Authorization", `Bearer ${token}`)
        .send(reqBody)
        .end((_, response) => {
          expect(response).to.have.status(StatusCodes.OK);
          expect(response.body).to.have.property("data");
          expect(response.body.data).to.have.property("patched_json");
          expect(response.body.data.patched_json).to.deep.equal(new_json);
          done();
        });
    }).timeout(5000);

    it("should return a validation error if request contains invalid body", (done) => {
      const reqBody = {
        patch: [],
        json: "name",
      };

      chai
        .request(app)
        .post("/patch")
        .set("Authorization", `Bearer ${token}`)
        .send(reqBody)
        .end((error, response) => {
          expect(response).to.have.status(StatusCodes.BAD_REQUEST);
          expect(response.body).to.have.property("error");
          expect(response.body.error).to.be.a("object");
          expect(response.body.error).to.have.property("name");
          expect(response.body.error.name).to.equal("ValidationError");
          done();
        });
    }).timeout(5000);

    it("should return an AuthError because authorization token is not included", (done) => {
      const reqBody = {
        patch: [],
        json: {},
      };

      chai
        .request(app)
        .post("/patch")
        .send(reqBody)
        .end((error, response) => {
          expect(response).to.have.status(StatusCodes.UNAUTHORIZED);
          expect(response.body).to.have.property("error");
          expect(response.body.error).to.be.a("object");
          expect(response.body.error).to.have.property("name");
          expect(response.body.error.name).to.equal("AuthError");
          done();
        });
    });
  });
});

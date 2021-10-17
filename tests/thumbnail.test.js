/* global describe require it before process */
const chai = require("chai");
const chaiHttp = require("chai-http");
const bcrypt = require("bcryptjs");
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

describe("Thumbnail Generation", () => {
  let token;

  before(async () => {
    token = await signJWT({ username: "admin", password: "new-password" });
  });

  describe("POST /thumbnail", () => {
    it("should return a thumbnail", (done) => {
      const reqBody = {
        image_url: faker.internet.avatar(),
      };
      chai
        .request(app)
        .post("/thumbnail")
        .set("Authorization", `Bearer ${token}`)
        .send(reqBody)
        .end((_, response) => {
          expect(response).to.have.status(StatusCodes.OK);
          done();
        });
    }).timeout(5000);

    it("should return a validation error if request contains invalid body", (done) => {
      const reqBody = {
        image_url: faker.lorem.lines(1),
      };

      chai
        .request(app)
        .post("/thumbnail")
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
        image_url: faker.lorem.lines(1),
      };

      chai
        .request(app)
        .post("/thumbnail")
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

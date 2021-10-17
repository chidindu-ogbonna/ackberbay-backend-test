/* global describe require it */
const chai = require("chai");
const chaiHttp = require("chai-http");
const { StatusCodes } = require("http-status-codes");
const app = require("../app");
const faker = require("faker");

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

describe("Login", () => {
  describe("POST /login", () => {
    it("should return a signed jwt token", (done) => {
      const reqBody = {
        username: faker.internet.userName(),
        password: faker.internet.password(
          faker.datatype.number({ min: 6, max: 10 })
        ),
      };

      chai
        .request(app)
        .post("/login")
        .send(reqBody)
        .end((_, response) => {
          expect(response).to.have.status(StatusCodes.OK);
          expect(response.body).to.have.property("data");
          expect(response.body.data).to.be.a("object");
          expect(response.body.data).to.have.property("user");
          expect(response.body.data.user).to.have.property("token");
          done();
        });
    });

    it("should return a validation error if request contains invalid body", (done) => {
      const reqBody = {
        username: faker.datatype.boolean() ? faker.internet.userName() : "",
        password: faker.internet.password(
          faker.datatype.number({ min: 1, max: 5 })
        ),
      };

      chai
        .request(app)
        .post("/login")
        .send(reqBody)
        .end((error, response) => {
          expect(response).to.have.status(StatusCodes.BAD_REQUEST);
          expect(response.body).to.have.property("error");
          expect(response.body.error).to.be.a("object");
          expect(response.body.error).to.have.property("name");
          expect(response.body.error.name).to.equal("ValidationError");
          done();
        });
    });
  });
});

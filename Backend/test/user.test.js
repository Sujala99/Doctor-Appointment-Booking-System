const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const dotenv = require('dotenv');

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);


describe("User API Tests", () => {
    it("should return 404 for invalid route", (done) => {
        chai.request(app)
            .get("/invalid-route")
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it("should register a user", (done) => {
        chai.request(app)
            .post("/users/register")
            .send({
                username: "testuser",
                email: "testuser@example.com",
                password: "password123",
                fullname: "Test User"
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.equal("User registered successfully");
                done();
            });
    });
});

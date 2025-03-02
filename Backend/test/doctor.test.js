const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const jwt = require("jsonwebtoken"); // Add jwt for token mocking
const app = require("../app"); // Adjust this path to your Express app entry file
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { expect } = chai;

chai.use(chaiHttp);

describe("Doctor API Tests", () => {
    let adminToken;
    let doctorId;

    before(async () => {
        const adminUser = {
            _id: "admin123",
            role: "admin",
        };
        
        // Mock the JWT token generation
        adminToken = jwt.sign(adminUser, 'your_jwt_secret_key');
        
        sinon.stub(User, "findOne").resolves(adminUser);
        sinon.stub(User.prototype, "save").resolves();
    });

    afterEach(() => {
        sinon.restore();  // Clean up after each test
    });

    it("should add a new doctor", async () => {
        const newDoctor = {
            username: "doc1",
            email: "doc1@example.com",
            fullname: "Dr. Test",
            password: "password123",
            specialization: "Cardiology",
        };

        sinon.stub(User, "findOne").resolves(null);
        sinon.stub(bcrypt, "hash").resolves("hashedPassword");
        sinon.stub(User.prototype, "save").resolves({ _id: "doctor123", ...newDoctor });

        const res = await chai.request(app)
            .post("/doctors/addDoctor")
            .set("Authorization", `Bearer ${adminToken}`) // Pass the JWT token
            .send(newDoctor);

        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message", "Doctor added successfully");
        doctorId = res.body.doctor._id;
    });

    it("should update a doctor", async () => {
        const updatedData = { specialization: "Neurology" };
        
        sinon.stub(User, "findOne").resolves({ _id: doctorId, role: "doctor", save: sinon.stub().resolves() });

        const res = await chai.request(app)
            .put(`/doctors/updateDoctor/${doctorId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(updatedData);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Doctor updated successfully");
    });

    it("should delete a doctor", async () => {
        sinon.stub(User, "findOneAndDelete").resolves({ _id: doctorId, role: "doctor" });

        const res = await chai.request(app)
            .delete(`/doctors/deleteDoctor/${doctorId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Doctor deleted successfully");
    });
});

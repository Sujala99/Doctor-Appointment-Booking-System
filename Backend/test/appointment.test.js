const request = require("supertest");
const app = require("../app"); // assuming app.js is your Express app
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

let tokenUser, tokenDoctor;
let testUserId, testDoctorId;
let appointmentId;

// Sample User and Doctor data
const sampleUser = {
    username: "Test User",
    email: "user@example.com",
    password: "password",
    role: "user",
};

const sampleDoctor = {
    username: "Test Doctor",
    email: "doctor@example.com",
    password: "password",
    role: "doctor",
    specialization: "General Medicine",
};

beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect("mongodb://localhost:27017/testDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Create sample users
    const user = new User(sampleUser);
    const doctor = new User(sampleDoctor);
    await user.save();
    await doctor.save();

    testUserId = user._id;
    testDoctorId = doctor._id;

    // Create user token and doctor token (assuming your authenticateToken middleware works with JWT)
    tokenUser = "user-jwt-token"; // Add your JWT generation logic here
    tokenDoctor = "doctor-jwt-token"; // Add your JWT generation logic here
});

// Clean up after tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe("Appointment API Tests", () => {
    // Test booking an appointment
    it("should book an appointment successfully", async () => {
        const appointmentData = {
            doctorId: testDoctorId,
            date: "2025-03-10",
            time: "10:00",
        };

        const response = await request(app)
            .post("/appointment/book")
            .set("Authorization", `Bearer ${tokenUser}`)
            .send(appointmentData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Appointment booked successfully");

        // Save appointmentId for future tests
        appointmentId = response.body.appointment._id;
    });

    // Test getting a user's appointment by ID
    it("should fetch the appointment by ID", async () => {
        const response = await request(app)
            .get(`/appointment/getappointment/${appointmentId}`)
            .set("Authorization", `Bearer ${tokenUser}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe(appointmentId);
        expect(response.body.userId).toBe(testUserId.toString());
        expect(response.body.doctorId).toBe(testDoctorId.toString());
    });

    // Test doctor viewing their appointments
    it("should fetch appointments for a doctor", async () => {
        const response = await request(app)
            .get("/appointment/doctor")
            .set("Authorization", `Bearer ${tokenDoctor}`);

        expect(response.status).toBe(200);
        expect(response.body.appointments.length).toBeGreaterThan(0);
    });

    // Test doctor updating the appointment status
    it("should allow doctor to update appointment status", async () => {
        const response = await request(app)
            .put("/appointment/status")
            .set("Authorization", `Bearer ${tokenDoctor}`)
            .send({
                appointmentId: appointmentId,
                status: "Accepted",
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Appointment Accepted successfully");
        expect(response.body.appointment.status).toBe("Accepted");
    });

    // Test user fetching their appointments
    it("should allow user to fetch their appointments", async () => {
        const response = await request(app)
            .get(`/appointment/getappointment/user/${testUserId}`)
            .set("Authorization", `Bearer ${tokenUser}`);

        expect(response.status).toBe(200);
        expect(response.body.appointments.length).toBeGreaterThan(0);
    });

    // Test user fetching all appointments
    it("should allow user to fetch all their appointments", async () => {
        const response = await request(app)
            .get("/appointment/user/getallappointment")
            .set("Authorization", `Bearer ${tokenUser}`);

        expect(response.status).toBe(200);
        expect(response.body.appointments.length).toBeGreaterThan(0);
    });
});

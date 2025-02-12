const express = require("express");
const appointmentController = require("../controller/appointmentController");
const { authenticateToken } = require("../security/Auth");

const router = express.Router();

// User books an appointment
router.post("/book", authenticateToken, appointmentController.bookAppointment);

// Doctor views their appointments
router.get("/doctor", authenticateToken, appointmentController.getAppointmentsForDoctor);

// Doctor updates appointment status
router.put("/status", authenticateToken, appointmentController.updateAppointmentStatus);

// User views their appointments
router.get("/user", authenticateToken, appointmentController.getAppointmentsForUser);

module.exports = router;

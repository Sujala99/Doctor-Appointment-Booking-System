const express = require("express");
const appointmentController = require("../controller/appointmentController");
const { authenticateToken } = require("../security/Auth");

const router = express.Router();

// User books an appointment
router.post("/book", authenticateToken, appointmentController.bookAppointment);


router.get("/getappointment/:id", appointmentController.appointmentById);

// Doctor views their appointments
router.get("/doctor", authenticateToken, appointmentController.getAppointmentsForDoctor);

// Doctor updates appointment status
router.put("/status", authenticateToken, appointmentController.updateAppointmentStatus);

// User views their appointments
router.get("/getappointment/user/:id", authenticateToken, appointmentController.getAppointmentsForUser);


router.get("/user/getallappointment", authenticateToken, appointmentController.getAllUserAppointments);

module.exports = router;

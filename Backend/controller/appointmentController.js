const Appointment = require("../models/Appointment");
const User = require("../models/User"); 
const Doctor = require("../models/Doctor");
const { notifyDoctorOnAppointment } = require("./notificationController");
const { notifyUserOnStatusChange } = require("./notificationController");

exports.updateAppointmentStatus = async (req, res) => {
    const { appointmentId, status } = req.body;

    try {
        if (req.user.role !== "doctor") {
            return res.status(403).json({ message: "Access Denied: Only doctors can update appointment status." });
        }

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.doctorId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access Denied: You cannot update this appointment." });
        }

        appointment.status = status;
        await appointment.save();

        // Notify the user about the appointment status change
        await notifyUserOnStatusChange(appointment.userId, req.user.id, appointmentId, status);

        res.status(200).json({ message: `Appointment ${status} successfully`, appointment });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        res.status(500).json({ message: "Server error: Unable to update appointment status", error });
    }
};

// Book an appointment (User)

// exports.bookAppointment = async (req, res) => {
//     const { doctorId, date, time } = req.body;

//     try {
//         const appointment = new Appointment({
//             userId: req.user.id, // User making the request
//             doctorId,
//             date,
//             time,
//         });

//         await appointment.save();

//         // Notify the doctor about the new appointment
//         await notifyDoctorOnAppointment(doctorId, req.user.id, appointment._id);

//         res.status(201).json({ message: "Appointment booked successfully", appointment });
//     } catch (error) {
//         console.error("Error booking appointment:", error);
//         res.status(500).json({ message: "Server error: Unable to book appointment", error });
//     }
// };
exports.bookAppointment = async (req, res) => {
    const { doctorId, date, time } = req.body;

    try {
        const appointment = new Appointment({
            userId: req.user.id, // User making the request
            doctorId,
            date,  // Date should be in the correct format (YYYY-MM-DD)
            time,  // Time as a string ("HH:mm")
        });

        await appointment.save();

        // Notify the doctor about the new appointment
        await notifyDoctorOnAppointment(doctorId, req.user.id, appointment._id);

        res.status(201).json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Server error: Unable to book appointment", error });
    }
};



// Get all appointments for a doctor (Doctor)
exports.getAppointmentsForDoctor = async (req, res) => {
    try {
        if (req.user.role !== "doctor") {
            return res.status(403).json({ message: "Access Denied: Only doctors can view their appointments." });
        }

        const appointments = await Appointment.find({ doctorId: req.user.id }).populate("userId", "username email");
        res.status(200).json({ message: "Appointments fetched successfully", appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Server error: Unable to fetch appointments", error });
    }
};

// Update appointment status (Doctor)

exports.updateAppointmentStatus = async (req, res) => {
    const { appointmentId, status } = req.body;

    try {
        if (req.user.role !== "doctor") {
            return res.status(403).json({ message: "Access Denied: Only doctors can update appointment status." });
        }

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.doctorId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access Denied: You cannot update this appointment." });
        }

        appointment.status = status;
        await appointment.save();

        // Notify the user about the appointment status change
        await notifyUserOnStatusChange(appointment.userId, req.user.id, appointmentId, status);

        res.status(200).json({ message: `Appointment ${status} successfully`, appointment });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        res.status(500).json({ message: "Server error: Unable to update appointment status", error });
    }
};



// Get all appointments for a user (User)
exports.getAppointmentsForUser = async (req, res) => {
    try {
        // Fetch appointments for the current user
        const appointments = await Appointment.find({ userId: req.user.id })
            .populate("doctorId", "name specialization");

        res.status(200).json({ 
            message: "Appointments fetched successfully", 
            appointments 
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ 
            message: "Server error: Unable to fetch appointments", 
            error 
        });
    }
};


exports.appointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate({ path: "userId", select: "fullname username" }) // Ensure correct field names
            .populate({ path: "doctorId", select: "fullname username specialization", match: { role: "doctor" } }); // Get doctor details from User model

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAllUserAppointments = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user from authentication
        
        const appointments = await Appointment.find({ userId })
            .populate({ path: "doctorId", select: "fullname" }) // Populating doctorId with name field only
            .sort({ createdAt: -1 }); // Sorting by newest first

        res.status(200).json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


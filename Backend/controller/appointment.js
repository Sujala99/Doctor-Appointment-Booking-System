const Appointment = require("../models/Appointment");

// Book an appointment (User)
exports.bookAppointment = async (req, res) => {
    const { doctorId, date, time } = req.body;

    try {
        const appointment = new Appointment({
            userId: req.user.id, // User making the request
            doctorId,
            date,
            time,
        });

        await appointment.save();
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

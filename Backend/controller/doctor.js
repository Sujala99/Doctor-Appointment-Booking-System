const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");

// 1. Add Doctor (Only Admin)
exports.addDoctor = async (req, res) => {
    const { name, email, specialization, qualification, experience, fees, availableSlots } = req.body;

    try {
        // Check if the user role is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied: Only admins can add doctors." });
        }

        // Check if the doctor already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: "Doctor with this email already exists." });
        }

        // Create a new doctor
        const doctor = new Doctor({
            name,
            email,
            specialization,
            qualification,
            experience,
            fees,
            availableSlots,
        });

        await doctor.save();

        res.status(201).json({ message: "Doctor added successfully", doctor });
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ message: "Server Error: Unable to add doctor", error: error.message });
    }
};

// 2. Get All Doctors (Accessible to Everyone)
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json({ message: "Doctors fetched successfully", doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: "Server Error: Unable to fetch doctors", error: error.message });
    }
};

// 3. Get Doctor by ID (Accessible to Everyone)
exports.getDoctorById = async (req, res) => {
    const doctorId = req.params.id;

    try {
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ message: "Doctor fetched successfully", doctor });
    } catch (error) {
        console.error("Error fetching doctor:", error);
        res.status(500).json({ message: "Server Error: Unable to fetch doctor", error: error.message });
    }
};

// 4. Update Doctor (Admin or Own Doctor Profile Only)
exports.updateDoctorById = async (req, res) => {
    const doctorId = req.params.id;
    const updates = req.body;

    try {
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Check if the user is admin or the doctor themselves
        if (req.user.role !== "admin" && req.user.email !== doctor.email) {
            return res.status(403).json({ message: "Access Denied: You are not allowed to update this doctor." });
        }

        // Update the doctor
        Object.keys(updates).forEach((key) => {
            doctor[key] = updates[key];
        });

        await doctor.save();

        res.status(200).json({ message: "Doctor updated successfully", doctor });
    } catch (error) {
        console.error("Error updating doctor:", error);
        res.status(500).json({ message: "Server Error: Unable to update doctor", error: error.message });
    }
};

// 5. Delete Doctor (Only Admin)
exports.deleteDoctorById = async (req, res) => {
    const doctorId = req.params.id;

    try {
        // Check if the user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied: Only admins can delete doctors." });
        }

        const doctor = await Doctor.findByIdAndDelete(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ message: "Doctor deleted successfully", doctor });
    } catch (error) {
        console.error("Error deleting doctor:", error);
        res.status(500).json({ message: "Server Error: Unable to delete doctor", error: error.message });
    }
};

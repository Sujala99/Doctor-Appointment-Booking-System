const mongoose = require("mongoose");
// const Doctor = require("../models/Doctor");
const User = require("../models/User");
const bcrypt = require("bcrypt");


// 1. Add Doctor (Only Admin)

exports.addDoctor = async (req, res) => {
    const { username, email, fullname, password, phonenumber, gender, dob, specialization, qualification, experience, fees, availableSlots, description } = req.body;

    try {
        // Ensure only admins can add doctors
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied: Only admins can add doctors." });
        }

        // Check if the doctor already exists
        const existingDoctor = await User.findOne({ email });
        if (existingDoctor) {
            if (existingDoctor.role === "doctor") {
                return res.status(400).json({ message: "Doctor already exists." });
            }

            // Update the user role to "doctor" and add doctor-specific fields
            existingDoctor.role = "doctor";
            existingDoctor.username = username;
            existingDoctor.fullname = fullname;
            existingDoctor.phonenumber = phonenumber;
            existingDoctor.gender = gender;
            existingDoctor.dob = dob;
            existingDoctor.specialization = specialization;
            existingDoctor.qualification = qualification;
            existingDoctor.experience = experience;
            existingDoctor.fees = fees;
            existingDoctor.availableSlots = availableSlots;
            existingDoctor.description = description;

            if (password) {
                existingDoctor.password = await bcrypt.hash(password, 10);
            }

            await existingDoctor.save();
            return res.status(200).json({ message: "Doctor updated successfully", doctor: existingDoctor });
        }

        // Create a new doctor
        const hashedPassword = await bcrypt.hash(password, 10);
        const doctor = new User({
            username,
            fullname,
            phonenumber,
            password: hashedPassword,
            gender,
            dob,
            email,
            role: "doctor",
            specialization,
            qualification,
            experience,
            fees,
            availableSlots,
            description,
        });

        await doctor.save();
        res.status(201).json({ message: "Doctor added successfully", doctor });
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ message: "Server Error: Unable to add doctor", error: error.message });
    }
};







// 2. Get All Doctors (Accessible to Everyone)
exports.getDoctors = async (req, res) => {
    try {
        // Fetch users with the role of "doctor"
        const doctors = await User.find({ role: "doctor" }).select("-password"); // Exclude password for security

        // Return the list of doctors
        return res.status(200).json({ doctors });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching doctors", error: error.message });
    }
};




// 3. Get Doctor by ID (Accessible to Everyone)
exports.getDoctorById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the doctor by ID and ensure their role is 'doctor'
        const doctor = await User.findOne({ _id: id, role: "doctor" });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Send back the doctor details
        res.status(200).json({ message: "Doctor fetched successfully", doctor });
    } catch (error) {
        console.error("Error fetching doctor by ID:", error.message);
        res.status(500).json({ message: "Server error: Unable to fetch doctor", error: error.message });
    }
};





// 4. Update Doctor (Admin or Own Doctor Profile Only)
exports.updateDoctorById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // Find the doctor by ID
        const doctor = await User.findOne({ _id: id, role: "doctor" });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Check if the user making the request is admin or the doctor themselves
        if (req.user.role !== "admin" && req.user.email !== doctor.email) {
            return res.status(403).json({ message: "Access Denied: You are not allowed to update this doctor." });
        }

        // Update the doctor details
        Object.keys(updates).forEach((key) => {
            doctor[key] = updates[key];
        });

        await doctor.save();

        res.status(200).json({ message: "Doctor updated successfully", doctor });
    } catch (error) {
        console.error("Error updating doctor:", error.message);
        res.status(500).json({ message: "Server Error: Unable to update doctor", error: error.message });
    }
};

// 5. Delete Doctor (Only Admin)
exports.deleteDoctorById = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the user is an admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied: Only admins can delete doctors." });
        }

        // Find and delete the doctor
        const doctor = await User.findOneAndDelete({ _id: id, role: "doctor" });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ message: "Doctor deleted successfully", doctor });
    } catch (error) {
        console.error("Error deleting doctor:", error.message);
        res.status(500).json({ message: "Server Error: Unable to delete doctor", error: error.message });
    }
};

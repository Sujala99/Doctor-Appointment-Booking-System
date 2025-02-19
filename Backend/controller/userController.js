const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const SECRET_KEY = "8261ba19898d0dcdfe6c0c411df74b587b2f54538f5f451633b71e39f957cf01";

exports.registerUser = async (req, res) => {
    const { username, phonenumber, email, fullname, password, dob, gender, address, image, role,specialization,qualification,experience,fees,availableSlots, } = req.body;

    try {

        const { username, phonenumber, email, fullname, password, dob, gender, address, image, role } = req.body;

        console.log("Received Data:", req.body); // Debugging: Check if all fields are received

        // Ensure all required fields are provided
        if (!username || !phonenumber || !email || !fullname || !password) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }



        
        const existingUser = await User.findOne({ email: email.trim() });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            username,
            phonenumber,
            email: email.trim(),
            fullname,
            password: hashedPassword,
            dob,
            gender,
            address,
            image,
            role, // Save the role as provided
            specialization,
            qualification,
            experience,
            fees,
            availableSlots

        });

        // Save the user to the database
        await user.save();

        res.status(201).json({ message: "User registered successfully",role });
    } catch (error) {
        console.error("Error during registration:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};



exports.loginUser = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Find the user by either username or email (case-insensitive)
        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp(`^${email?.trim()}$`, 'i') } },
                { username: { $regex: new RegExp(`^${username?.trim()}$`, 'i') } },
            ],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};






exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Invalid or expired token." });
    }
};


const sendEmail = async (to, subject, text) => {
    try {
        console.log(`Sending email to: ${to}`); // Debug log
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // Your Gmail address
                pass: process.env.EMAIL_PASSWORD // Your Gmail password or app password
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            text,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};


exports.getAllUser = async (req, res) => {
    try {
        console.log("User making request:", req.user); // ✅ Debugging log
        
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized. No user found in request." });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        // Fetch users with role "user" or "admin"
        const users = await User.find(
            { role: { $in: ["user", "admin"] } }, 
            "username phonenumber email fullname dob gender address image role"
        );

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error in getAllUser:", error);
        res.status(500).json({ error: error.message || "Server error" });
    }
};


exports.updateUser = async (req, res) => {
    try {
        console.log("User making request:", req.user); // Debugging

        // Ensure only admin can update users
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        const userId = req.params.id; // Extract user ID from request params
        const updateData = req.body; // Get updated data from request body

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true } // Return updated user and validate fields
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error in updateUser:", error.message); // Log the error message
        res.status(500).json({ error: error.message || "Server error" });
    }
};



exports.deleteUser = async (req, res) => {
    try {
        console.log("User making request:", req.user); // Debugging

        // Ensure only admin can delete users
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        const userId = req.params.id; // Extract user ID from request params

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ error: "Server error" });
    }
};



exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a file" });
        }

        // Check file size limit
        const maxSize = process.env.MAX_FILE_UPLOAD || 2 * 1024 * 1024; // Default 2MB
        if (req.file.size > maxSize) {
            return res.status(400).json({
                message: `Please upload an image less than ${maxSize / (1024 * 1024)}MB`,
            });
        }

        // Update user's image in the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.image = req.file.filename;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            data: req.file.filename,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

















const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const SECRET_KEY = "8261ba19898d0dcdfe6c0c411df74b587b2f54538f5f451633b71e39f957cf01";

exports.registerUser = async (req, res) => {
    const { username, phonenumber, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email: email.trim() });

        if (existingUser) {
            if (existingUser.role === 'doctor') {
                // Send Reset Password Email
                const token = jwt.sign({ id: existingUser._id }, SECRET_KEY, { expiresIn: "1h" });
                const resetLink = `http://localhost:3000/reset-password/${token}`;

                await sendEmail(
                    email,
                    "Reset Your Password",
                    `Hello,\n\nIt looks like you are trying to register as a doctor. Since you are already added as a doctor, please use the link below to set your password.\n\nReset Password Link: ${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this message.\n\nToken: ${token}`
                );

                return res.status(400).json({
                    message: "Doctor already exists. A password reset link has been sent to your email."
                });
            }
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            phonenumber,
            email: email.trim(),
            password: hashedPassword,
            role,
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully", role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Email received in request:", email); // Debug log

        // Perform a case-insensitive search for the email
        const user = await User.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } });
        console.log("User found in DB:", user); // Debug log

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password
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

        res.status(200).json({ token, role: user.role });
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



















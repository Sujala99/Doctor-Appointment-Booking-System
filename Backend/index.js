const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

// Initialize dotenv to load environment variables
dotenv.config();

const app = express();

// [SECTION] Routes
const userRoutes = require("./routes/user");
const doctorRoutes = require("./routes/doctor");
const blogRoutes = require("./routes/blog");
const appointmentRoutes = require("./routes/appointment");
const notificationRoutes = require("./routes/notification");


// Middleware
app.use(express.json());
app.use("/users", userRoutes);
app.use("/doctors", doctorRoutes);
app.use("/blogs", blogRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);

// Connect to MongoDB
connectDB();

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

const path = require("path"); // <-- Add this line


// Initialize dotenv to load environment variables
dotenv.config();


const app = express();

// [SECTION] Routes
const userRoutes = require("./routes/userRoute");
const doctorRoutes = require("./routes/doctorRoute");
const blogRoutes = require("./routes/blogRoute");
const appointmentRoutes = require("./routes/appointmentRoute");
const notificationRoutes = require("./routes/notificationRoute");


// const fileRoutes = require("./routes/fileRoutes"); // Add file upload route


app.use(cors()); // Enable CORS


// Middleware
app.use(express.json());
app.use("/users", userRoutes);
app.use("/doctors", doctorRoutes);
app.use("/blogs", blogRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/uploads", express.static("public/uploads"));


// Connect to MongoDB
connectDB();

// Start the server
const port = 4000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

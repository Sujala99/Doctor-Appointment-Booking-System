const express = require("express");
const http = require("http"); // Required for Socket.io
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { socketHandler } = require("./socket/socket"); // Correct import

// Initialize dotenv to load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server


// Middleware
app.use(cors({
    origin: "http://localhost:5173", // Adjust based on your frontend URL
    credentials: true
}));


app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

// [SECTION] Routes
const userRoutes = require("./routes/userRoute");
const doctorRoutes = require("./routes/doctorRoute");
const blogRoutes = require("./routes/blogRoute");
const appointmentRoutes = require("./routes/appointmentRoute");
const notificationRoutes = require("./routes/notificationRoute");
const messageRoute = require("./routes/messageRoute"); // Add chat routes
const dashboardRoutes = require("./routes/dashboardRoutes"); // Add chat routes

app.use("/users", userRoutes);
app.use("/doctors", doctorRoutes);
app.use("/blogs", blogRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/message", messageRoute); // Add chat API routes
app.use("/dashboard", messageRoute); // Add chat API routes

// Initialize Socket.io
socketHandler(server);

// Start the server
const port = 4000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
module.exports = app;  // Add this line so tests can use the app

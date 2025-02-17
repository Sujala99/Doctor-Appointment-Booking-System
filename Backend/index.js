const express = require("express");
const http = require("http"); // Required for Socket.io
const { Server } = require("socket.io"); // Import Socket.io
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (change in production)
        methods: ["GET", "POST"]
    }
});



// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));



// [SECTION] Routes
const userRoutes = require("./routes/userRoute");
const doctorRoutes = require("./routes/doctorRoute");
const blogRoutes = require("./routes/blogRoute");
const appointmentRoutes = require("./routes/appointmentRoute");
const notificationRoutes = require("./routes/notificationRoute");
// const chatRoutes = require("./routes/chatRoute"); // Add chat routes




app.use("/users", userRoutes);
app.use("/doctors", doctorRoutes);
app.use("/blogs", blogRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/api/notifications", notificationRoutes);
// app.use("/chat", chatRoutes); // Add chat API routes




// Real-time chat logic
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle joining a room (for doctor-patient chat)
    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    // Handle sending messages
    socket.on("sendMessage", (data) => {
        console.log("Message received:", data);
        io.to(data.room).emit("receiveMessage", data);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});



// Start the server
const port = 4000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

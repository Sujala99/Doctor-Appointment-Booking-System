let userSocketMap = {}; // Store userId => socketId mapping

// Socket connection handler
const socketHandler = (server) => {
    const { Server } = require("socket.io");
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Allow all origins (change in production)
            methods: ["GET", "POST"],
            credentials: true

        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Store the socketId with the userId
        socket.on("register", (userId) => {
            userSocketMap[userId] = socket.id;
            console.log(`User ${userId} registered with socket ${socket.id}`);
        });

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
            // Remove socketId when user disconnects
            for (const userId in userSocketMap) {
                if (userSocketMap[userId] === socket.id) {
                    delete userSocketMap[userId];
                    break;
                }
            }
        });
    });
};

// Helper function to get receiver socketId
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

module.exports = { socketHandler, getReceiverSocketId };

const { getReceiverSocketId, io } = require("../socket/socket.js");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");


exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params; // Receiver's ID from the route parameter
        const senderId = req.user.id; // Use req.user.id after token is verified

        console.log("Sender ID:", senderId);
        console.log("Receiver ID:", receiverId);
        console.log("Message:", message);

        if (!message || !receiverId) {
            return res.status(400).json({ error: "Message and receiverId are required" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // Create a new conversation if it doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create and save the new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        });

        // Add message reference to conversation
        conversation.messages.push(newMessage._id);
        await conversation.save(); // Save conversation with the new message

        // Send the message via Socket.io (real-time)
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};



exports.getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // Receiver ID from URL
    const senderId = req.user.id; // Sender ID from authenticated user

    console.log("Fetching messages between:");
    console.log("Sender ID:", senderId);
    console.log("Receiver ID:", userToChatId);

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // Populate messages

    console.log("Retrieved Conversation:", conversation);

    if (!conversation) return res.status(200).json([]); // No conversation found

    // Mark all messages as read that were sent to the current user
    await Message.updateMany(
      { receiverId: senderId, isRead: false },
      { isRead: true }
    );

    res.status(200).json(conversation.messages); // Return messages
  } catch (error) {
    console.log("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const express = require("express");
const messageController= require("../controller/messageController");
const { authenticateToken } = require("../security/Auth");

const router = express.Router();

router.get("/:id", authenticateToken, messageController.getMessages); // Get messages with a specific user
router.post("/send/:id", authenticateToken, messageController.sendMessage); // Send message to a user

module.exports = router;

const express = require("express");
const { authenticateToken } = require("../security/Auth");
const notificationController = require("../controller/notificationController");

const router = express.Router();

// Fetch all notifications for the logged-in user
router.get("/", authenticateToken, notificationController.getNotificationsForUser);

// Mark a notification as read
router.put("/:notificationId/read", authenticateToken, notificationController.markNotificationAsRead);

module.exports = router;

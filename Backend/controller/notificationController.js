const Notification = require("../models/Notification");

// Send notification when user books an appointment
exports.notifyDoctorOnAppointment = async (doctorId, userId, appointmentId) => {
    try {
        const message = "A new appointment has been booked.";
        const notification = new Notification({
            recipientId: doctorId,
            senderId: userId,
            appointmentId,
            message,
        });
        await notification.save();
    } catch (error) {
        console.error("Error sending notification to doctor:", error);
    }
};

// Send notification when doctor updates appointment status
exports.notifyUserOnStatusChange = async (userId, doctorId, appointmentId, status) => {
    try {
        const message = `Your appointment status has been updated to: ${status}`;
        const notification = new Notification({
            recipientId: userId,
            senderId: doctorId,
            appointmentId,
            message,
        });
        await notification.save();
    } catch (error) {
        console.error("Error sending notification to user:", error);
    }
};

// Fetch notifications for a user
exports.getNotificationsForUser = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipientId: req.user.id })
            .populate("senderId", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "Notifications fetched successfully", notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Unable to fetch notifications", error });
    }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Unable to mark notification as read", error });
    }
};

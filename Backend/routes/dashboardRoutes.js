const express = require("express");
const router = express.Router();
const blogController = require("../controller/dashboardController"); // Ensure the path is correct
const { authenticateToken } = require("../security/Auth");

// Admin Middleware - to ensure only admin can access
// const isAdmin = (req, res, next) => {
//     if (req.user && req.user.role === "admin") {
//         next();
//     } else {
//         res.status(403).json({ message: "Access denied" });
//     }
// };

// Add admin check to routes
router.get("/users-per-month", authenticateToken, blogController.getUsersPerMonth);
router.get("/gender-distribution", authenticateToken, blogController.getGenderDistribution);

module.exports = router;

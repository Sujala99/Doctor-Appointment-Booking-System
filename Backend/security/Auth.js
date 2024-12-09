const jwt = require("jsonwebtoken");

const SECRET_KEY = "8261ba19898d0dcdfe6c0c411df74b587b2f54538f5f451633b71e39f957cf01";

function authenticateToken(req, res, next) {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    console.log("Authorization Header:", authHeader); // Debug log
    console.log("Extracted Token:", token); // Debug log

    if (!token) {
        return res.status(401).json({ message: "Access denied: No token provided." });
    }

    try {
        const verifiedUser = jwt.verify(token, SECRET_KEY); // Verify the token
        console.log("Verified User:", verifiedUser); // Debug log
        req.user = verifiedUser; // Attach verified user data to request
        next();
    } catch (error) {
        console.error("Token verification error:", error.message); // Debug log
        res.status(403).json({ message: "Invalid token" });
    }
}

function authorizeRole(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRole };

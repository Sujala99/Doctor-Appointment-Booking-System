import jwt from "jsonwebtoken";

const SECRET_KEY = "8261ba19898d0dcdfe6c0c411df74b587b2f54538f5f451633b71e39f957cf01";

export const authenticateToken = (req, res, next) => {
    // Get token from the Authorization header
    const authHeader = req.header("Authorization");

    // Check if token exists and is in correct "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied: No token provided or token format is invalid." });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    console.log("Authorization Header:", authHeader);
    console.log("Extracted Token:", token);

    if (!token) {
        return res.status(401).json({ message: "Access denied: No token provided." });
    }

    try {
        // Verify the token using SECRET_KEY
        const verifiedUser = jwt.verify(token, SECRET_KEY);
        console.log("Verified User:", verifiedUser);

        // Attach the verified user to the request object
        req.user = verifiedUser;
        console.log("req.user set to:", req.user); // Log to verify if req.user is correctly set

        // Continue to the next middleware/route handler
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(403).json({ message: "Invalid token or token expired." });
    }
};


// Role-based authorization middleware
export const authorizeRole = (roles) => {
    return (req, res, next) => {
        // Ensure the user has a valid role before proceeding
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
        }
        next();
    };
};

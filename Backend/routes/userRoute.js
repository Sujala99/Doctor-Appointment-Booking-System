const express = require("express");
const userController = require("../controller/userController");
const { authenticateToken, authorizeRole } = require("../security/Auth");
const router = express.Router();
const { upload } = require("../security/upload");




// User routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/getallusers", authenticateToken, userController.getAllUser); 
router.put("/updateuser/:id", authenticateToken, userController.updateUser); 
router.delete("/deleteuser/:id", authenticateToken, userController.deleteUser); 

// Image upload route
router.post('/uploadImage', authenticateToken, upload.single('profilePicture'), userController.uploadImage);


router.post("/reset-password/:token", userController.resetPassword);

module.exports = router;

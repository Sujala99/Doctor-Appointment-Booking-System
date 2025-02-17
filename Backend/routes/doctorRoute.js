const express = require("express");
const doctorController = require("../controller/doctorController");
const { authenticateToken } = require("../security/Auth");
const { upload } = require("../security/upload");

const router = express.Router();

// Routes
router.post("/addDoctor", authenticateToken, doctorController.addDoctor); // Only Admin
router.get("/getAllDoctors", doctorController.getDoctors); // Everyone
router.get("/getDoctor/:id", doctorController.getDoctorById); // Everyone
router.put("/updateDoctor/:id", authenticateToken, doctorController.updateDoctorById); // Admin or Own Doctor Profile
router.delete("/deleteDoctor/:id", authenticateToken, doctorController.deleteDoctorById); // Only Admin


router.post('/uploadImage', authenticateToken, upload.single('profilePicture'), doctorController.uploadImage);

module.exports = router;

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const { uploadImage, getImage } = require("../controller/fileController");


// const router = express.Router();

// // Configure Multer for file storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/uploads/"); // Set upload directory
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to filename
//     },
// });

// // Multer instance with file filter for images
// const upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//         const fileTypes = /jpeg|jpg|png|gif/; // Allowed file types
//         const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
//         const mimeType = fileTypes.test(file.mimetype);

//         if (extName && mimeType) {
//             cb(null, true);
//         } else {
//             cb(new Error("Only images are allowed!"), false); // Reject invalid file types
//         }
//     },
// });

// // Routes
// router.post("/upload", upload.single("image"), uploadImage); // Single file upload
// router.get("/:id", getImage); // Fetch a specific image by ID

// module.exports = router;

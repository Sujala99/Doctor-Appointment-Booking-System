// const Image = require("../models/File");  // Ensure this is the correct path

// // Upload Image function
// exports.uploadImage = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "No file uploaded" });
//         }

//         // Save image details to the database
//         const newImage = new Image({
//             filename: req.file.filename,
//             path: req.file.path,
//             originalName: req.file.originalname,
//             mimetype: req.file.mimetype,
//             size: req.file.size,
//         });

//         await newImage.save();

//         res.status(201).json({
//             message: "Image uploaded successfully",
//             image: newImage,
//         });
//     } catch (error) {
//         console.error("Error uploading image:", error);
//         res.status(500).json({ message: "Error uploading image", error: error.message });
//     }
// };


// // Serve Image File
// exports.getImage = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const image = await Image.findById(id);
//         if (!image) {
//             return res.status(404).json({ message: "Image not found" });
//         }

//         res.sendFile(path.resolve(image.path));
//     } catch (error) {
//         console.error("Error fetching image:", error);
//         res.status(500).json({ message: "Error fetching image", error: error.message });
//     }
// };

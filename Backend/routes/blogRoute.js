const express = require("express");
const blogController = require("../controller/blogController"); // Ensure the path is correct
const {authenticateToken} = require("../security/Auth");
const { upload } = require("../security/upload");

const router = express.Router();

router.post("/addBlog", authenticateToken, blogController.addBlog);
router.get("/allBlog", blogController.getAllBlogs);
router.get("/blogById/:id", blogController.getById);
router.put("/updateBlog/:id", authenticateToken, blogController.updateBlog);
router.delete("/deleteBlog/:id", authenticateToken, blogController.deleteBlog);


router.post('/uploadImage', authenticateToken, upload.single('blogImage'), blogController.uploadImage);

module.exports = router;



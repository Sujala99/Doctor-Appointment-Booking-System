const express = require("express");
const blogController = require("../controller/blog"); // Ensure the path is correct
const {authenticateToken} = require("../security/Auth");

const router = express.Router();

router.post("/addBlog", authenticateToken, blogController.addBlog);
router.get("/allBlog", blogController.getAllBlogs);
router.get("/blogById/:id", blogController.getById);
router.put("/updateBlog/:id", authenticateToken, blogController.updateBlog);
router.delete("/deleteBlog/:id", authenticateToken, blogController.deleteBlog);

module.exports = router;



const mongoose = require("mongoose");
const Blog = require("../models/Blog");

// Add a new blog (Only Admin)
exports.addBlog = async (req, res) => {
    const { title, content } = req.body;

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied: Only admins can add blogs." });
        }

        const blog = new Blog({
            title,
            content,
            author: req.user.username,
        });

        await blog.save();
        res.status(201).json({ message: "Blog added successfully", blog });
    } catch (error) {
        console.error("Error adding blog:", error);
        res.status(500).json({ message: "Server error: Unable to add blog", error });
    }
};

// Get all blogs (Accessible to everyone)
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Blogs fetched successfully", blogs });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Server Error: Unable to fetch blogs", error: error.message });
    }
};

// Get a blog by ID (Accessible to everyone)
exports.getById = async (req, res) => {
    const blogId = req.params.id;

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog fetched successfully", blog });
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).json({ message: "Server Error: Unable to fetch blog", error: error.message });
    }
};

// Update a blog (Only Admin)
exports.updateBlog = async (req, res) => {
    const blogId = req.params.id;
    const updates = req.body;

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied: Only admins can update blogs." });
        }

        const blog = await Blog.findByIdAndUpdate(blogId, updates, { new: true });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog updated successfully", blog });
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ message: "Server Error: Unable to update blog", error: error.message });
    }
};

// Delete a blog (Only Admin)
exports.deleteBlog = async (req, res) => {
    const blogId = req.params.id;

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access Denied: Only admins can delete blogs." });
        }

        const blog = await Blog.findByIdAndDelete(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ message: "Server Error: Unable to delete blog", error: error.message });
    }
};
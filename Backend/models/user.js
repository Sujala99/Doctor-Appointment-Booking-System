const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true

    },
    phonenumber: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    address: {
        type: String
    },
    image: {
        type: String,
        default: null,
  },
    role: {
        type: String,
        enum: ["user", "doctor", "admin"],
        default: "user"
    },
    description: {
        type: String,
    
    },
    specialization: String,
    qualification: String,
    experience: Number,
    fees: String,
    availableSlots: String
});

module.exports = mongoose.model("User", userSchema);

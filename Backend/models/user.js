const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "doctor", "admin"],
        default: "user"
    },
    specialization: String,
    qualification: String,
    experience: Number,
    fees: String,
    availableSlots: String
});

module.exports = mongoose.model('User', userSchema);

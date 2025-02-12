const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	specialization: {
		type: String,
		required: true
	},
	qualification: {
		type: String,
		required: true
	},
	experience: {
		type: Number,
		required: true
	},
	fees: {
		type: String,
		required: true
	},
	availableSlots: {
		type: String,
		required: true
	},
	description: {
		type: String,
	
	},
})

module.exports= mongoose.model("Doctor", DoctorSchema);
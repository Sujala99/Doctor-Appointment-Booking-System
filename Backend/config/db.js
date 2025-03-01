const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/db_appointment_booking_system", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB is connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;




// const mongoose = require("mongoose");

// const connectDB = async () => {
//     try {
//         // Choose connection URI based on environment
//         // const uri = process.env.NODE_ENV === "test" ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
        
//         // await mongoose.connect(uri, {
//         //     useNewUrlParser: true,
//         //     useUnifiedTopology: true,
//         // });
//         // console.log("MongoDB is connected ");
//         const uri = process.env.NODE_ENV === "test" ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
//         console.log("Connecting to MongoDB using URI: ", uri);  // Add this line

//     } catch (error) {
//         console.error("MongoDB connection error:", error.message);
//         process.exit(1); // Exit process with failure
//     }
// };

// module.exports = connectDB;

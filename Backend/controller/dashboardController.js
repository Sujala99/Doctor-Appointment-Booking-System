const User = require("../models/User");

// // 1️⃣ Get Users Per Month for Bar Chart
//  exports.getUsersPerMonth = async (req, res) => {
//     try {
//         const data = await User.aggregate([
//             {
//                 $group: {
//                     _id: { $month: "$createdAt" },
//                     count: { $sum: 1 }
//                 }
//             },
//             { $sort: { _id: 1 } }
//         ]);
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ message: "Failed to fetch users per month", error });
//     }
// };

// // 2️⃣ Get Gender Distribution for Pie Chart
//  exports.getGenderDistribution = async (req, res) => {
//     try {
//         const data = await User.aggregate([
//             {
//                 $group: {
//                     _id: "$gender",
//                     count: { $sum: 1 }
//                 }
//             }
//         ]);
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ message: "Failed to fetch gender distribution", error });
//     }
// };

exports.getDashboardStats = async (req, res) => {
    try {
        // Count users by role: "user", "doctor", "admin"
        const patientCount = await User.countDocuments({ role: "user" });
        const doctorCount = await User.countDocuments({ role: "doctor" });
        const adminCount = await User.countDocuments({ role: "admin" });

        res.status(200).json({
            patients: patientCount,
            doctors: doctorCount,
            admins: adminCount,
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error.message);
        res.status(500).json({ message: "Server error while fetching dashboard stats." });
    }
};

exports.genderbasis = async (req, res) => {
    try {
        // Count users by role: "user", "doctor", "admin"
        const maleCount = await User.countDocuments({ gender: "male" });
        const femaleCount = await User.countDocuments({ gender: "female" });
        const otherCount = await User.countDocuments({ gender: "other" });

        res.status(200).json({
            male: maleCount,
            female: femaleCount,
            other: otherCount,
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error.message);
        res.status(500).json({ message: "Server error while fetching dashboard stats." });
    }
};



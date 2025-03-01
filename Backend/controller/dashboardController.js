const User = require("../models/User");

// 1️⃣ Get Users Per Month for Bar Chart
 exports.getUsersPerMonth = async (req, res) => {
    try {
        const data = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users per month", error });
    }
};

// 2️⃣ Get Gender Distribution for Pie Chart
 exports.getGenderDistribution = async (req, res) => {
    try {
        const data = await User.aggregate([
            {
                $group: {
                    _id: "$gender",
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch gender distribution", error });
    }
};


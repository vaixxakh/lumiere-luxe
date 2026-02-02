const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ isDeleted: false});
        const totalProducts = await Product.countDocuments({ isDeleted: false});
        const totalOrders = await Order.countDocuments({ isDeleted: false});

        const revenueAgg = await Order.aggregate([
            {$match : { status:  { $regex: /^delivered$/i }} },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount"},
                },
            },
        ]);

        const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

        const statusAgg = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: {$sum: 1},
                },
            },
        ]);

        const statusMap = {};
        statusAgg.forEach((item) => {
            statusMap[item._id] = item.count;
        });

        const recentOrdersdata = await Order.find()
        .sort({ createdAt: -1})
        .limit(5)
        .populate("user", "name")
        .select("totalAmount status createdAt");

        const recentOrders = recentOrdersdata.map((order) => ({
            orderId: order._id,
            customerName: order.user?.name || "Guest",
            total: order.totalAmount,
            status: order.status,
        }));

        const recentUsers = await User.find({ isDeleted: false})
            .sort({ createdAt: -1})
            .limit(5)
            .select("name email");

            res.status(200).json({
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,

                recentOrders,
                recentUsers,
            });
    } catch ( error ) {
        console.log("Dashboard Error:", error);
        res.status(500).json({
            message: "Failed to lead dashboard data",
        });
    };
}
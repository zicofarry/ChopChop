const Menu = require('../models/Menu');
const Order = require('../models/Order');
const Table = require('../models/Table');

const getStats = async (req, res) => {
    try {
        const cafeId = req.user.cafe;

        const totalMenuItems = await Menu.countDocuments({ cafe: cafeId });

        const pendingOrders = await Order.countDocuments({ cafe: cafeId, status: { $in: ['pending', 'confirmed', 'preparing', 'ready'] } });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOrders = await Order.find({
            cafe: cafeId,
            createdAt: { $gte: today }
        });

        const todayRevenue = todayOrders
            .filter(o => o.paymentStatus === 'paid')
            .reduce((sum, o) => sum + o.totalPrice, 0);

        const totalTables = await Table.countDocuments({ cafe: cafeId, isActive: true });

        const recentOrders = await Order.find({ cafe: cafeId })
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            overview: {
                totalMenuItems,
                totalTables
            },
            pending: {
                orders: pendingOrders
            },
            today: {
                revenue: todayRevenue,
                orders: todayOrders.length
            },
            recent: {
                orders: recentOrders
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStats };

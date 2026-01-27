const Menu = require('../models/Menu');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Testimonial = require('../models/Testimonial');

// @desc    Get admin dashboard stats
// @route   GET /api/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        // Get counts
        const totalOrders = await Order.countDocuments();
        const totalReservations = await Reservation.countDocuments();
        const totalMenuItems = await Menu.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const totalTestimonials = await Testimonial.countDocuments();
        const pendingTestimonials = await Testimonial.countDocuments({ approved: false });

        // Get today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: today }
        });

        const todayReservations = await Reservation.countDocuments({
            date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        });

        // Get revenue
        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // Get today's revenue
        const todayRevenueResult = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: today },
                    status: { $ne: 'cancelled' }
                }
            },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const todayRevenue = todayRevenueResult[0]?.total || 0;

        // Get pending counts
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const pendingReservations = await Reservation.countDocuments({ status: 'pending' });

        // Recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Recent reservations
        const recentReservations = await Reservation.find()
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            overview: {
                totalOrders,
                totalReservations,
                totalMenuItems,
                totalCustomers,
                totalRevenue,
                totalTestimonials,
            },
            today: {
                orders: todayOrders,
                reservations: todayReservations,
                revenue: todayRevenue,
            },
            pending: {
                orders: pendingOrders,
                reservations: pendingReservations,
                testimonials: pendingTestimonials,
            },
            recent: {
                orders: recentOrders,
                reservations: recentReservations,
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

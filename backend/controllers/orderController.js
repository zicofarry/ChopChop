const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Cafe = require('../models/Cafe');
const { createPayment } = require('../services/paymentService');

const createOrder = async (req, res) => {
    try {
        const { items, totalPrice, paymentMethod, notes, tableNumber, customerName, cafe } = req.body;

        const orderData = {
            items,
            totalPrice,
            paymentMethod: paymentMethod || 'cash',
            notes,
            tableNumber,
            customerName,
            cafe: cafe || req.user?.cafe
        };

        if (req.user) {
            orderData.user = req.user._id;
        }

        const order = await Order.create(orderData);

        if (paymentMethod === 'qris') {
            const paymentResult = await createPayment(order, 'qris');
            if (paymentResult.success) {
                await Payment.create({
                    order: order._id,
                    method: 'qris',
                    status: 'pending',
                    amount: totalPrice
                });
            }
            res.status(201).json({ order, payment: paymentResult.data });
        } else {
            await Payment.create({
                order: order._id,
                method: 'cash',
                status: 'pending',
                amount: totalPrice
            });
            res.status(201).json({ order, payment: null });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createGuestOrder = async (req, res) => {
    try {
        const { items, totalPrice, paymentMethod, notes, tableNumber, customerName, cafe } = req.body;

        let cafeId = cafe;
        if (!cafeId) {
            const defaultCafe = await Cafe.findOne({ slug: 'chopchop' });
            cafeId = defaultCafe?._id;
        }

        const order = await Order.create({
            items,
            totalPrice,
            paymentMethod: paymentMethod || 'cash',
            notes,
            tableNumber,
            customerName,
            cafe: cafeId
        });

        if (paymentMethod === 'qris') {
            const paymentResult = await createPayment(order, 'qris');
            if (paymentResult.success) {
                await Payment.create({
                    order: order._id,
                    method: 'qris',
                    status: 'pending',
                    amount: totalPrice
                });
            }
            res.status(201).json({ order, payment: paymentResult.data });
        } else {
            await Payment.create({
                order: order._id,
                method: 'cash',
                status: 'pending',
                amount: totalPrice
            });
            res.status(201).json({ order, payment: null });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.menu', 'name image')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.menu', 'name image');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCafeOrders = async (req, res) => {
    try {
        const filter = { cafe: req.user.cafe };
        if (req.query.status) {
            filter.status = req.query.status;
        }
        const orders = await Order.find(filter)
            .populate('user', 'name email phone')
            .populate('items.menu', 'name image')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const payment = await Payment.findOne({ order: req.params.id });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = 'paid';
        payment.paidAt = new Date();
        payment.verifiedBy = req.user._id;
        await payment.save();

        await Order.findByIdAndUpdate(req.params.id, { paymentStatus: 'paid' });

        res.json({ message: 'Payment verified successfully', payment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, createGuestOrder, getMyOrders, getOrderStatus, getCafeOrders, updateOrderStatus, verifyPayment };

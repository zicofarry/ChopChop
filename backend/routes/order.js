const express = require('express');
const router = express.Router();
const { createOrder, createGuestOrder, getMyOrders, getOrderStatus, getCafeOrders, updateOrderStatus, verifyPayment } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/guest', createGuestOrder);
router.get('/status/:id', getOrderStatus);

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/', protect, admin, getCafeOrders);
router.put('/:id', protect, admin, updateOrderStatus);
router.put('/:id/verify-payment', protect, admin, verifyPayment);

module.exports = router;

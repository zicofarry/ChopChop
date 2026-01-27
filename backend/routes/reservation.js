const express = require('express');
const router = express.Router();
const { createReservation, getMyReservations, getAllReservations, updateReservationStatus } = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);
router.get('/', protect, admin, getAllReservations);
router.put('/:id', protect, admin, updateReservationStatus);

module.exports = router;

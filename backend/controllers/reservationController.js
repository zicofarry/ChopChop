const Reservation = require('../models/Reservation');

// @desc    Create reservation
// @route   POST /api/reservations
const createReservation = async (req, res) => {
    try {
        const { date, time, guests, notes } = req.body;

        const reservation = await Reservation.create({
            user: req.user._id,
            date,
            time,
            guests,
            notes
        });

        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's reservations
// @route   GET /api/reservations/my
const getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user._id })
            .sort({ date: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reservations (Admin)
// @route   GET /api/reservations
const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('user', 'name email phone')
            .sort({ date: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update reservation status (Admin)
// @route   PUT /api/reservations/:id
const updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (reservation) {
            res.json(reservation);
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReservation, getMyReservations, getAllReservations, updateReservationStatus };

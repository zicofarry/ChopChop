const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Reservation date is required']
    },
    time: {
        type: String,
        required: [true, 'Reservation time is required']
    },
    guests: {
        type: Number,
        required: [true, 'Number of guests is required'],
        min: 1,
        max: 20
    },
    notes: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);

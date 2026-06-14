const Testimonial = require('../models/Testimonial');

const getApprovedTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ approved: true })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTestimonial = async (req, res) => {
    try {
        const { content, rating } = req.body;

        const testimonial = await Testimonial.create({
            user: req.user._id,
            cafe: req.user.cafe,
            content,
            rating
        });

        res.status(201).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ cafe: req.user.cafe })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTestimonial = async (req, res) => {
    try {
        const { approved } = req.body;
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            { approved },
            { new: true }
        );

        if (testimonial) {
            res.json(testimonial);
        } else {
            res.status(404).json({ message: 'Testimonial not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getApprovedTestimonials, createTestimonial, getAllTestimonials, updateTestimonial };

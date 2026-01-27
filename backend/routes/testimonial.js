const express = require('express');
const router = express.Router();
const { getApprovedTestimonials, createTestimonial, getAllTestimonials, updateTestimonial } = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', getApprovedTestimonials);
router.post('/', protect, createTestimonial);
router.get('/all', protect, admin, getAllTestimonials);
router.put('/:id', protect, admin, updateTestimonial);

module.exports = router;

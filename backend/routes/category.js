const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', getAllCategories);
router.post('/', protect, admin, createCategory);

module.exports = router;

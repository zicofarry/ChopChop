const express = require('express');
const router = express.Router();
const {
    getAllMenu,
    getFeaturedMenu,
    getMenuById,
    getMenuByCategory,
    createMenu,
    updateMenu,
    deleteMenu,
    getAllMenuAdmin
} = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', getAllMenu);
router.get('/featured', getFeaturedMenu);
router.get('/admin', protect, admin, getAllMenuAdmin);
router.get('/:id', getMenuById);
router.get('/category/:categoryId', getMenuByCategory);
router.post('/', protect, admin, createMenu);
router.put('/:id', protect, admin, updateMenu);
router.delete('/:id', protect, admin, deleteMenu);

module.exports = router;

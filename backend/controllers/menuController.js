const Menu = require('../models/Menu');

// @desc    Get all menu items
// @route   GET /api/menu
const getAllMenu = async (req, res) => {
    try {
        const menu = await Menu.find({ available: true }).populate('category', 'name icon');
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get featured menu items
// @route   GET /api/menu/featured
const getFeaturedMenu = async (req, res) => {
    try {
        const menu = await Menu.find({ featured: true, available: true }).populate('category', 'name icon');
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
const getMenuById = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id).populate('category', 'name icon');
        if (menu) {
            res.json(menu);
        } else {
            res.status(404).json({ message: 'Menu not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get menu by category
// @route   GET /api/menu/category/:categoryId
const getMenuByCategory = async (req, res) => {
    try {
        const menu = await Menu.find({
            category: req.params.categoryId,
            available: true
        }).populate('category', 'name icon');
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create menu item (Admin)
// @route   POST /api/menu
const createMenu = async (req, res) => {
    try {
        const menu = await Menu.create(req.body);
        res.status(201).json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update menu item (Admin)
// @route   PUT /api/menu/:id
const updateMenu = async (req, res) => {
    try {
        const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (menu) {
            res.json(menu);
        } else {
            res.status(404).json({ message: 'Menu not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete menu item (Admin)
// @route   DELETE /api/menu/:id
const deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findByIdAndDelete(req.params.id);
        if (menu) {
            res.json({ message: 'Menu removed' });
        } else {
            res.status(404).json({ message: 'Menu not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllMenu, getFeaturedMenu, getMenuById, getMenuByCategory, createMenu, updateMenu, deleteMenu };

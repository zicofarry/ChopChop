const Menu = require('../models/Menu');

const getAllMenu = async (req, res) => {
    try {
        const filter = { available: true };
        if (req.query.cafe) {
            filter.cafe = req.query.cafe;
        }
        const menu = await Menu.find(filter).populate('category', 'name icon');
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFeaturedMenu = async (req, res) => {
    try {
        const filter = { featured: true, available: true };
        if (req.query.cafe) {
            filter.cafe = req.query.cafe;
        }
        const menu = await Menu.find(filter).populate('category', 'name icon');
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

const getMenuByCategory = async (req, res) => {
    try {
        const filter = { category: req.params.categoryId, available: true };
        if (req.query.cafe) {
            filter.cafe = req.query.cafe;
        }
        const menu = await Menu.find(filter).populate('category', 'name icon');
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createMenu = async (req, res) => {
    try {
        const menu = await Menu.create({ ...req.body, cafe: req.user.cafe });
        res.status(201).json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

const getAllMenuAdmin = async (req, res) => {
    try {
        const menu = await Menu.find({ cafe: req.user.cafe })
            .populate('category', 'name icon');
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllMenu, getFeaturedMenu, getMenuById, getMenuByCategory, createMenu, updateMenu, deleteMenu, getAllMenuAdmin };

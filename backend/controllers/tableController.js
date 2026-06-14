const Table = require('../models/Table');
const Cafe = require('../models/Cafe');

const getTableByToken = async (req, res) => {
    try {
        const table = await Table.findOne({ qrCodeToken: req.params.token })
            .populate('cafe', 'name slug logo');
        if (table && table.isActive) {
            res.json(table);
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCafeTables = async (req, res) => {
    try {
        const tables = await Table.find({ cafe: req.user.cafe })
            .sort({ tableNumber: 1 });
        res.json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTable = async (req, res) => {
    try {
        const { tableNumber } = req.body;
        const table = await Table.create({
            cafe: req.user.cafe,
            tableNumber
        });
        res.status(201).json(table);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTable = async (req, res) => {
    try {
        const { tableNumber, isActive } = req.body;
        const table = await Table.findByIdAndUpdate(
            req.params.id,
            { tableNumber, isActive },
            { new: true }
        );
        if (table) {
            res.json(table);
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTable = async (req, res) => {
    try {
        const table = await Table.findByIdAndDelete(req.params.id);
        if (table) {
            res.json({ message: 'Table removed' });
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPublicTables = async (req, res) => {
    try {
        const cafe = await Cafe.findOne({ slug: req.params.slug || 'chopchop' });
        if (!cafe) {
            return res.status(404).json({ message: 'Cafe not found' });
        }
        const tables = await Table.find({ cafe: cafe._id, isActive: true })
            .select('tableNumber qrCodeToken')
            .sort({ tableNumber: 1 });
        res.json({ cafe: { name: cafe.name, slug: cafe.slug }, tables });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTableByToken, getCafeTables, getPublicTables, createTable, updateTable, deleteTable };

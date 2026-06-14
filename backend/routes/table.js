const express = require('express');
const router = express.Router();
const { getTableByToken, getCafeTables, getPublicTables, createTable, updateTable, deleteTable } = require('../controllers/tableController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/cafe/:slug', getPublicTables);
router.get('/token/:token', getTableByToken);
router.get('/', protect, admin, getCafeTables);
router.post('/', protect, admin, createTable);
router.put('/:id', protect, admin, updateTable);
router.delete('/:id', protect, admin, deleteTable);

module.exports = router;

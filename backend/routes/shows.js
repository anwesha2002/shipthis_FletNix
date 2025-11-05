const express = require('express');
const { getShows, getShowById } = require('../controllers/showsController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getShows);
router.get('/:id', authMiddleware, getShowById);

module.exports = router;
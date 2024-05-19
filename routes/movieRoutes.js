const express = require('express');
const { route } = require('./authRoutes');
const { getMovies } = require('../controllers/musicController');
const router = express.Router();

router.get('/', getMovies);

module.exports = router;
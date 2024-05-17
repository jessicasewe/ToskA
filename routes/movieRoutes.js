const express = require('express');
const { route } = require('./authRoutes');
const router = express.Router();

router.get('/', getMovies);

module.exports = router;
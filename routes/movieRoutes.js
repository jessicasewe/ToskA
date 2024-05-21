const express = require('express');
const router = express.Router();
const { getMovies } = require('../controllers/movieController');

router.get('/movies', getMovies);

module.exports = router;

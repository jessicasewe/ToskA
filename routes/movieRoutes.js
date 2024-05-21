const express = require('express');
const router = express.Router();
const { _getMoviesGenres } = require('../controllers/movieController');

router.get('/movies/genres', async (req, res) => {
    try {
        const genres = await _getMoviesGenres();
        res.json(genres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

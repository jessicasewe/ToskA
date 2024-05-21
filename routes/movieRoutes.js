const express = require('express');
const router = express.Router();
const { _getMoviesGenres, _getMoviesByGenre, _getTVGenres, _getTVShowsByGenre } = require('../controllers/movieController');

router.get('/movies/genres', async (req, res) => {
    try {
        const genres = await _getMoviesGenres();
        res.json(genres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/movies/genres/:genreId', async (req, res) => {
    const genreId = req.params.genreId;
    try {
        const movies = await _getMoviesByGenre(genreId);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/tv/genres', async (req, res) => {
    try {
        const genres = await _getTVGenres();
        res.json(genres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/tv/genres/:genreId', async (req, res) => {
    const genreId = req.params.genreId;
    try {
        const tvShows = await _getTVShowsByGenre(genreId);
        res.json(tvShows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

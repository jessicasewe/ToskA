const express = require('express');
const router = express.Router();
const { _getMoviesGenres, _getMoviesByGenre, _getTVGenres, _getTVShowsByGenre, _getMovieById, _getTVShowById } = require('../controllers/movieController');

//route for movie genres
router.get('/movies/genres', async (req, res) => {
    try {
        const genres = await _getMoviesGenres();
        res.json(genres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//route for movie by genre
router.get('/movies/genres/:genreId', async (req, res) => {
    const genreId = req.params.genreId;
    try {
        const movies = await _getMoviesByGenre(genreId);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//route for movie by id
router.get('/movies/:movieId', async (req, res) => {
    const movieId = req.params.movieId;
    try {
        const movie = await _getMovieById(movieId);
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//route for tvshow genres
router.get('/tv/genres', async (req, res) => {
    try {
        const genres = await _getTVGenres();
        res.json(genres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//route for tvshow by genre
router.get('/tv/genres/:genreId', async (req, res) => {
    const genreId = req.params.genreId;
    try {
        const tvShows = await _getTVShowsByGenre(genreId);
        res.json(tvShows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//route for tvshow by id
router.get('/tv/:tvId', async (req, res) => {
    const tvId = req.params.tvId;
    try {
        const tvShow = await _getTVShowById(tvId);
        res.json(tvShow);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;

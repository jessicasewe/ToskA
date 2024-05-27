const express = require('express');
const router = express.Router();
const { _getMoviesGenres, _getMoviesByGenre, _getTVGenres, _getTVShowsByGenre, _getMovieById, _getTVShowById } = require('../controllers/movieController');

const tmdbApiKey = process.env.TMDB_API_KEY;
// async function _getMoviesGenres() {
//     const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbApiKey}&language=en-US`);
//     const data = await response.json();
//     return data.genres;
// }

// Route for movie genres with images
router.get('/movies/genres', async (req, res) => {
    try {
        const genres = await _getMoviesGenres();
        const genresWithImages = await Promise.all(genres.map(async (genre) => {
            const moviesResponse = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&with_genres=${genre.id}&language=en-US&sort_by=popularity.desc`);
            const moviesData = await moviesResponse.json();
            const imagePath = moviesData.results[0]?.poster_path || '/default-image.jpg'; // Fallback image
            return { ...genre, imagePath: `https://image.tmdb.org/t/p/w500${imagePath}` };
        }));

        res.json(genresWithImages);
    } catch (error) {
        console.error('Error fetching genres:', error);
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
        const genresWithImages = await Promise.all(genres.map(async (genre) => {
            const tvShowsResponse = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${tmdbApiKey}&with_genres=${genre.id}&language=en-US&sort_by=popularity.desc`);
            const tvShowsData = await tvShowsResponse.json();
            const imagePath = tvShowsData.results[0]?.poster_path || '/default-image.jpg'; // Fallback image
            return { ...genre, imagePath: `https://image.tmdb.org/t/p/w500${imagePath}` };
        }));

        res.json(genresWithImages);
    } catch (error) {
        console.error('Error fetching genres:', error);
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

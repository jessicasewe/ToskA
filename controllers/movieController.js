const axios = require('axios');
require('dotenv').config();

// Configuration for TMDB API
const tmdb = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

const _getMoviesGenres = async () => {
    try {
        const response = await tmdb.get('/genre/movie/list?language=en');
        return response.data.genres;
    } catch (error) {
        console.error('Failed to fetch movie genres:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch movie genres');
    }
};

const _getMoviesByGenre = async (genreId) => {
    try {
        const response = await tmdb.get('/discover/movie', {
            params: {
                with_genres: genreId,
                langauge: 'en-US'
            }
        });
        return response.data.results;
    } catch (error){
        console.error('Failed to fetch movies by genre:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch movies by genre');
    }
};

module.exports = {
    _getMoviesGenres,
    _getMoviesByGenre
};

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


// Get movie genres
const _getMoviesGenres = async () => {
    try {
        const response = await tmdb.get('/genre/movie/list?language=en');
        return response.data.genres;
    } catch (error) {
        console.error('Failed to fetch movie genres:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch movie genres');
    }
};


// Get movies by genre
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


// Get movie by id
const _getMovieById = async (movieId) => {
    try {
        const response = await tmdb.get(`/movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch movie by id:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch movie by id');
    }
};


// Get TV genres
const _getTVGenres = async () => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/tv/list', {
            params: {
                language: 'en',
                api_key: process.env.TMDB_API_KEY
            }
        });
        return response.data.genres;
    } catch (error) {
        console.error('Failed to fetch TV genres:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch TV genres');
    }
};


// Get TV shows by genre
const _getTVShowsByGenre = async (genreId) => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/tv', {
            params: {
                with_genres: genreId,
                language: 'en',
                api_key: process.env.TMDB_API_KEY
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch TV shows by genre:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch TV shows by genre');
    }
}


// Get TV show by id
const _getTVShowById = async (tvShowId) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}`, {
            params: {
                language: 'en',
                api_key: process.env.TMDB_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch TV show by id:', error.response ? error.response.data : error.message);
        throw new Error('Failed to fetch TV show by id');
    }
};


module.exports = {
    _getMoviesGenres,
    _getMoviesByGenre,
    _getTVGenres,
    _getTVShowsByGenre,
    _getMovieById,
    _getTVShowById
};

const axios = require('axios');
require('dotenv').config();

// Configuration for TMDB API
const tmdb = axios.create({
    baseURL: process.env.TMDB_BASE_URL,
    params: {
        api_key: process.env.TMDB_API_KEY
    }
});

console.log("TMDB Axios Instance Configuration:", tmdb.defaults);
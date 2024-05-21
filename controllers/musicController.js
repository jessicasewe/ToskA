const axios = require('axios');
const cron = require('node-cron');
const redis = require('redis');
require('dotenv').config();

// let currentToken = process.env.SPOTIFY_TOKEN;

//redis client
const redisClient = redis.createClient(process.env.REDIS_URL);

redisClient.on('error', (err) => console.error('Redis client error', err));
// Connect to Redis
redisClient.connect().catch(console.error);


// Get access token
async function getToken() {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const token = response.data.access_token;
        console.log('New token generated:', token);
        await redisClient.set('spotify_token', token, { EX: 3300 });
        return token;
    } catch (error) {
        console.error('Failed to obtain access token:', error.message);
        throw new Error('Failed to obtain access token');
    }
}

// Get token from redis
async function getValidToken() {
    let token = await redisClient.get('spotify_token');
    if (!token) {
        token = await getToken();
    }
    return token;
}


// Get genres
const _getGenres = async () => {
    try {
        const token = await getValidToken();
        const response = await axios.get('https://api.spotify.com/v1/browse/categories?locale=sv_GH', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        return response.data.categories.items;
    } catch (error) {
        throw new Error('Failed to get genres: ' + error.message);
    }
}


// Get playlist by genre
const _getPlaylistByGenre = async (genreId) => {
    try {
        const token = await getValidToken();
        const limit = 10;
        const response = await axios.get(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        return response.data.playlists.items;
    } catch (error) {
        console.log(error)
        throw new Error('Failed to get playlists by genre: ' + error.message);
    }
}


// Get tracks by playlist
const _getTracksByPlaylist = async (playlistId) => {
    try { 
        const token = await getValidToken();
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        return response.data.items;
    } catch (error) {
        console.log(error)
        throw new Error('Failed to get tracks by playlist: ' + error.message);
    }
}


// Get track by id
const _getTrackById = async (trackId) => {
    try {
        const token = await getValidToken();
        const response = await axios.get('https://api.spotify.com/v1/tracks/' + trackId, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error('Failed to get track by id: ' + error.message);
    }
}


// Schedule a job to refresh the token every 55 minutes
cron.schedule('*/55 * * * *', async () => {
    await getToken();
    console.log('Token refreshed');
});

module.exports = {
    getToken,
    _getGenres,
    _getPlaylistByGenre,
    _getTracksByPlaylist,
    _getTrackById,
};

const axios = require('axios');
const cron = require('node-cron');
require('dotenv').config();

let currentToken = process.env.SPOTIFY_TOKEN;


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

        currentToken = response.data.access_token;
        console.log('New token generated:', currentToken);
        return currentToken;
    } catch (error) {
        console.error('Failed to obtain access token:', error.message);
        throw new Error('Failed to obtain access token');
    }
}

// Get genres
const _getGenres = async () => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/browse/categories?locale=sv_GH', {
            headers: { 'Authorization': 'Bearer ' + currentToken }
        });
        return response.data.categories.items;
    } catch (error) {
        throw new Error('Failed to get genres: ' + error.message);
    }
}


// Get playlist by genre
const _getPlaylistByGenre = async (genreId) => {
    try {
        const limit = 10;
        const response = await axios.get(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            headers: { 'Authorization': 'Bearer ' + currentToken }
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
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { 'Authorization': 'Bearer ' + currentToken }
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
        const response = await axios.get('https://api.spotify.com/v1/tracks/' + trackId, {
            headers: { 'Authorization': 'Bearer ' + currentToken }
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
    _getTrackById
    
};

const axios = require('axios');
const cron = require('node-cron');
require('dotenv').config();

let currentToken = process.env.SPOTIFY_TOKEN;

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



// Schedule a job to refresh the token every 55 minutes
cron.schedule('*/55 * * * *', async () => {
    await getToken();
    console.log('Token refreshed');
});

module.exports = {
    getToken,
    _getGenres,
    _getPlaylistByGenre,
    
};

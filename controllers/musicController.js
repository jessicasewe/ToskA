const axios = require('axios');

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

        return response.data.access_token;
    } catch (error) {
        throw new Error('Failed to obtain access token');
    }
}

const _getGenres = async () => {
    try {
        const token = await getToken(); // Get the token dynamically
        const response = await axios.get('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        return response.data.categories.items;
    } catch (error) {
        throw new Error('Failed to get genres: ' + error.message);
    }
}

module.exports = {
    getToken,
    _getGenres
};
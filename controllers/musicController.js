const axios = require('axios');

const getToken = async () => {
    try {
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;

        const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', 
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authString}`
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting token:', error);
        throw new Error('Error getting token');
    }
}

module.exports = getToken;
const express = require('express');
const router = express.Router();
const { getToken, _getGenres } = require('../controllers/musicController');

// Endpoint to get genres
router.get('/genres', async (req, res) => {
    try {
        const token = await getToken();
        const genres = await _getGenres(token);
        res.json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

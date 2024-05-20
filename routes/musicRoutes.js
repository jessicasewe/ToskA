const express = require('express');
const router = express.Router();
const { _getGenres } = require('../controllers/musicController');

router.get('/genres', async (req, res) => {
    try {
        const genres = await _getGenres();
        res.json(genres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { _getGenres, _getPlaylistByGenre, _getTracksByPlaylist } = require('../controllers/musicController');

router.get('/genres', async (req, res) => {
    try {
        const genres = await _getGenres();
        res.json(genres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/playlist/:genreId', async (req, res) => {
    const genreId = req.params.genreId;
    try {
        const playlists = await _getPlaylistByGenre(genreId);
        res.json(playlists);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

router.get('/tracks/:playlistId', async (req, res) => {
    const playlistId = req.params.playlistId;
    try {
        const tracks = await _getTracksByPlaylist(playlistId);
        res.json(tracks);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
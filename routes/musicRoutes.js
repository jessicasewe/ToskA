const express = require('express');
const router = express.Router();
const { _getGenres, _getPlaylistByGenre, _getTracksByPlaylist, _getTrackById } = require('../controllers/musicController');


//route for genres
router.get('/genres', async (req, res) => {
    try {
        const genres = await _getGenres();
        res.json(genres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//route for playlist by genre
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


//route for tracks by playlist
router.get('/tracks/:playlistId', async (req, res) => {
    const playlistId = req.params.playlistId;
    try {
        const tracks = await _getTracksByPlaylist(playlistId);
        res.json(tracks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//route for track by id
router.get('/track/:trackId', async (req, res) => {
    const trackId = req.params.trackId;
    try {
        const track = await _getTrackById(trackId);
        res.json(track);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
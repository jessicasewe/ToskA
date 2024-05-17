const express = require('express');
const router = express.Router();

router.get('/', getMusic);

module.exports = router;
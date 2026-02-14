const express = require('express');
const router = express.Router();
const { generateBuild } = require('../controllers/buildController');

router.post('/', generateBuild);

module.exports = router;

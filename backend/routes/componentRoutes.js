const express = require('express');
const router = express.Router();
const { getAllComponents } = require('../controllers/componentController');

router.get('/', getAllComponents);

module.exports = router;

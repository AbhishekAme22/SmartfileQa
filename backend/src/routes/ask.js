const express = require('express');
const askController = require('../controllers/askController');
const router = express.Router();

router.post('/', askController.handleAsk);

module.exports = router;

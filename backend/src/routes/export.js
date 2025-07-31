const express = require('express');
const exportController = require('../controllers/exportController');
const router = express.Router();

router.post('/', exportController.handleExport);

module.exports = router;

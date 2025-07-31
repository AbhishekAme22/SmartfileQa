const express = require('express');
const uploadRoutes = require('./upload');
const askRoutes = require('./ask');
const exportRoutes = require('./export');

const router = express.Router();
router.use('/upload', uploadRoutes);
router.use('/ask', askRoutes);
router.use('/export', exportRoutes);

module.exports = router;

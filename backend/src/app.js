require('dotenv').config();
const express = require('express');
const multer = require('multer');
const routes = require('./routes');

const cors = require('cors');
const app = express();

// Allow all origins for development
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

'use strict';

// Initiating our server
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true },
    () => console.log ('Connected to DB, Gina'));

// Import routes
const authRoute = require('./routes/auth.js');

// Route middlewares
app.use('/api/user', authRoute);

app.listen(3000, () => console.log('Server up and running, Gina'));

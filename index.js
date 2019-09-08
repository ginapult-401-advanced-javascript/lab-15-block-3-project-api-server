'use strict';

// Import app/server start from app.js

const init = require('./src/app.js').init;

// Import app-level dependencies
const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
};
// Connect to DB
mongoose.connect(process.env.DB_CONNECT, options, () => {
    console.log ('Connected to DB, Gina');
});

init(process.env.PORT || 3000);
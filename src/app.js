'use strict';

// Import app
const express = require('express');
const app = express();

// Import app-level middleware
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

// Use app-level middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Import content and auth routes 
const authRoutes = require('./routes/auth-routes');
const contentRoutes = require('./routes/content-routes.js');

// // Use routes middleware
app.use(authRoutes);
app.use(contentRoutes);

// Import error-handling middlware
const error404 = require('./middleware/404.js');
const errorHandler = require('./middleware/500.js');

// Use error-handling middleware
app.use(error404);
app.use(errorHandler);

// Export instance of express on a property called server to index.js
// Export start server property to index.js
module.exports = {};
module.exports.server = app;
module.exports.init = 
  (port) => {
    app.listen( port, () => {
      console.log('Server up and running, Gina');
      });
    };


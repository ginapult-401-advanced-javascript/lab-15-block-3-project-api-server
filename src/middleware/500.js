'use strict';

function errorHandler(error, request, response) {
  response.statu(500).send('The 500 Internal Server Error is a very general HTTP status code that means something has gone wrong on the web site\'s server but the server could not be more specific on what the exact problem is.');
}

module.exports = errorHandler;
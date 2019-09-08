'use strict';

function error404 (request, response) {
  response.status(404).send('The 404 error indicates that while the server itself is reachable, the specific page showing the error is not.');
}

module.exports = error404;
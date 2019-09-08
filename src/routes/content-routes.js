'use strict';

const express = require('express');
const contentRouter = express.Router();
const helpers = require('../middleware/helpers.js');
const modelLoader = helpers.modelLoader;
const authenticate = helpers.authenticate;

contentRouter.param('model', modelLoader);
contentRouter.get('/content/:model', authenticate, get);
contentRouter.post('/content/:model', authenticate, create);
contentRouter.put('/content/:model', authenticate, update);
contentRouter.delete('/content/:model', authenticate, remove);

function get(request, response, next) {
  if(request.query.id) {
    return request.model.read(request.query.id)
    .then(results => response.status(200).json(results))
    .catch(error => next(error));
  } else {
    return request.model.read()
    .then(results => response.status(200).json(results))
    .catch(error => next(error));
  }
}

function create(request, response, next) {
  if (request.body) {
    return request.model.create(request.body)
    .then(results => response.status(200).json(results))
    .catch(error => next(error));
  } else response.send('Unable to create.');
}

function update(request, response, next) {
  if (request.query.id && request.body) {
    return request.model.update(request.query.id, request.body)
    .then(results => response.status(200).json(results))
    .catch(error => next(error));
  } else response.send('Unable to update.');
}

function remove(request, response, next) {
  if (request.query.id) {
    return request.model.remove(request.query.id)
    .then(results => response.status(200).json(results))
    .catch(error => next(error));
  } else response.send('Unable to delete.');
}

module.exports = contentRouter;
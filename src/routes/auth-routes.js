'use strict';

// Import instance of express
const express = require ('express');

// Import express Router
const authRouter = express.Router();

// Import User-model.js 
const UserModel = require('../models/auth/User-model.js');

// Import helpers.js and its "authenticate" function
const helpers = require('../middleware/helpers.js');
const authenticate = helpers.authenticate;

// Use authRouter to post to routes
authRouter.post('/signup', signup);
authRouter.post('/signin', authenticate, signin);

// Create signup function
function signup (request, response, next) {
  let newUser = new UserModel (request.body);
  newUser.save()
  .then( user => {
    response.status(200).json(user);
  })
  .catch( error => next( error ));
}

// Create signin function
function signin (request, response) {
  response.status(200).json( request.token );
}

module.exports = authRouter;

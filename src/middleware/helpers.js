'use strict';

const UserModel = require('../models/auth/User-model.js');

// Create object to export
module.exports = {};

// Create modelLoader method on object to load appropriate models
module.exports.modelLoader = (request, response, next) => {
  let model = request.params.model;
  let schema = require('../models/content/${model}/${model}-schema.js');
  let Model = require('../models/content/crud-model.js');
  request.model = new Model(schema);
  next();
};

// Create and export authenticate method on object to authenticate user prior to accessing route
// Includes splitting header, checking for basic or token auth, running either basic (decoding) or token authentication, and checking for role authorization

module.exports.authenticate = (request, response, next) => {

  try {
    let path = request.originalUrl.split('/')[1];
    let [authType, authString] = request.headers.authorization.split(' ');
    if (authType.toLowerCase() === 'basic' && path === 'signin') {
      return basic(authString);
    } else if (authType.toLowerCase() === 'bearer' && ['products', 'categories'].includes(request.params.model)) {
      return token(authString);
    } else response.send('Could not authenticate.');
  } catch(error) {
    next(error);
  }

  function basic (basicAuthString) {
    let credentials = decode(basicAuthString);
    return UserModel.basicAuth(credentials)
    .then(user => {
      if(user) {
        request.user = user.username;
        request.token = user.generateToken();
        next();
      }
    })
    .catch(error => next(error));
  }

  function decode(authString) {
    let buffer = Buffer.from(authString, 'base64').toString();
    let [username, password] = buffer.split(':');
    return { username, password };
  }

  function token (tokenAuthString) {
    return UserModel.tokenAuth(tokenAuthString)
    .then(user => {
      if(user) {
        if(roleCheck(user.role, request.method.toLowerCase())) {
          next();
        } else response.send('Not authorized.')
      } else response.send('Unable to authenticate token.')
    })
    .catch(error => next(error));
  }

  function roleCheck (role, method) {
    const key = {
      user : ['get', 'put'],
      admin : ['get', 'post', 'put', 'delete'],
    };
    return key[role].includes(method) ? true : false;
  }

};





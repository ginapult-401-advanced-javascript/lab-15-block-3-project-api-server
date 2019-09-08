'use strict';

// Import app-level middleware
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create the mongoose user schema
const user = new mongoose.Schema({
  username : {
    type: String,
    require: true,
    unique: true
  },
  password : {
    type: String,
    require: true,
    unique: false,
  },
  role : {
    type: String,
    default: 'user', enum : ['user', 'admin']
  },
});

// Create user.pre function to hash password before saving
user.pre('save', function(next) {
  const saltRounds = 10;
  bcrypt.hash(this.password, saltRounds)
  .then(hashedPassword => {
    this.password = hashedPassword;
    next();
  })
  .catch(console.error);
});

// Create basicAuth method to check username and password exists in DB, if yes, returns user
user.statics.basicAuth = function (credentials) {
  let query = { username : credentials.username };
  return this.findOne(query)
  .then(user => {
    if (user && user.comparePassword(credentials.password)) {
      return user;
    } else console.log('Invalid password.');
  })
  .catch(error => console.log('Basic Auth:', error));
};

// Create tokenAuth method to verify user token, returns user
user.statics.tokenAuth = function (token) {
  let payload = jwt.verify(token, process.env.SECRET);
  return this.findById(payload.id)
  .then(user => {
    return user ? user : null;
  })
  .catch(error => console.log('Token Auth:', error));
};

// Create comparePassword method to compare entered password with DB password
user.methods.comparePassword = function (passwordString) {
  return bcrypt.compare(passwordString, this.password)
  .then(valid => valid ? this : null)
  .catch(error => console.log('Password Compare:', error));
};

// Create generateToken function to generate a token for user
user.methods.generateToken = function () {
  let payload = { id : this._id };
  return jwt.sign(payload, process.env.SECRET);
};

// Export User-model to be used by auth-routes.js
module.exports = mongoose.model('user', user);
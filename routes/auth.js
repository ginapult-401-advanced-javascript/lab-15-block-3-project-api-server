'use strict';

const router = require ('express').Router();
const User = require('../model/User.js'); // now have access to the User model
const { signupValidation } = require ('../validation.js');
const bcrypt = require('bcryptjs');




router.post('/signup', async (request, response) => {
    // Validate the data before we submit and save user to DB
    const { error } = signupValidation(request.body);
    if (error) return response.status(400).send(error.details[0].message);

    // Check if new user is already in DB by going to User model and findOne()
    const emailExists = await User.findOne({ email: request.body.email });
    if (emailExists) return response.status(400).send('Email already exists');

    // If exists, hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(request.body.password, salt);

    // Create a new user
    const user = new User ({
        name: request.body.name,
        email: request.body.email,
        password: hashedPassword
    });
    // Submit and save new user
    try {
       const savedUser = await user.save();
       response.send({user: user._id});
    }
    // Catch error
    catch (error) {
        response.status(400).send(error);
    }
});

module.exports = router;
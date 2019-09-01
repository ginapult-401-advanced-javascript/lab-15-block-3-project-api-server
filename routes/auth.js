'use strict';

const router = require ('express').Router();

router.post('/signup', (request, response) => { // localhost:3000/api/user/signup
    response.send('Sign up, Gina');
});

module.exports = router;
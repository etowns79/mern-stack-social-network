const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');


const { signUp, signin, signout } = require('../controllers/auth')

const { userById } = require('../controllers/user')


router.post('/signup',
    [
        check('name', "name is required").not().isEmpty(),
        check('email', "Email is required").not().isEmpty(),
        check('email', "Must be a valid email").isEmail(),
        check('hashed_password', "Password must be at least 5 characters long").isLength({ min: 5 }),
        check('hashed_password', "Passsword is required").not().isEmpty()

    ],
    signUp)

router.post("/signin", signin)

router.get("/signout", signout)

router.param('userId', userById)

module.exports = router;
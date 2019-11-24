const express = require('express');
const router = express.Router();
const { requireSignin } = require('../controllers/auth')
const { check, validationResult } = require('express-validator');


const { getPosts, createPost, postsByUser } = require('../controllers/posts')

const { userById } = require('../controllers/user')

router.get('/', getPosts);

router.post('/new/:userId', requireSignin,
    [
        check('title', "Title is required").not().isEmpty(),
        check('title', "Title must be greater than 4 characters long").isLength({ min: 4, max: 150 }),
        check('body', "Body is required").not().isEmpty(),
        check('body', "Body must be greater than 4 characters long").isLength({ min: 4, max: 2000 })
    ],
    createPost)

router.get("/by/:userId", requireSignin, postsByUser)

router.param("userId", userById);

module.exports = router;

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');


const { getPosts, createPost } = require('../controllers/posts')

router.get('/', getPosts);

router.post('/',
    [
        check('title', "Title is required").not().isEmpty(),
        check('title', "Title must be greater than 4 characters long").isLength({ min: 4, max: 150 }),
        check('body', "Body is required").not().isEmpty(),
        check('body', "Body must be greater than 4 characters long").isLength({ min: 4, max: 2000 })
    ],
    createPost)

module.exports = router;

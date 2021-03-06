const express = require('express');
const router = express.Router();
const { requireSignin } = require('../controllers/auth')
const { check, validationResult } = require('express-validator');


const { getPosts, createPost, postsByUser, postById, deletePost, isPoster, updatePost } = require('../controllers/posts')

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
router.delete("/:postId", requireSignin, isPoster, deletePost)
router.put("/edit/:postId", requireSignin, isPoster, updatePost)

router.param("userId", userById);
router.param("postId", postById);

module.exports = router;

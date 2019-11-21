const Post = require('../models/post')
const { check, validationResult } = require('express-validator')

exports.getPosts = (req, res) => {
    res.json({
        posts: [
            { title: 'first post' },
            { title: 'second post' }
        ]
    })
}

exports.createPost = async (req, res) => {
    try {
        const post = new Post(req.body);
        const savedPost = await post.save()
        res.status(200).json({ post: savedPost })
    } catch (error) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array()[0].msg })
    }


}
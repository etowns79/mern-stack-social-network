const Post = require('../models/post')
const { check, validationResult } = require('express-validator')

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().select("_id title body");
        res.status(200).json({ posts });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
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
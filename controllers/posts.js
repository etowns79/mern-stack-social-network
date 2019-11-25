const Post = require('../models/post')
const formidable = require('formidable');
const fs = require('fs')
const _ = require('lodash');
const { check, validationResult } = require('express-validator')



exports.postById = async (req, res, next, id) => {
    try {
        const post = await Post.findById(id).populate('postedBy', "_id name")
        if (!post) return res.status(400).json({ error: "Post was not found" })
        req.post = post
        next()

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.isPoster = (req, res, next) => {
    try {
        const authorized = req.post && req.auth && req.post.postedBy._id == req.auth._id

        if (!authorized) return res.status(403).json({ error: "User is not authorized to perform this action" })
        next();
    } catch (error) {
        res.status(403).json({ error: error.message })
    }
}

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("postedBy", "_id name").select("_id title body");
        res.status(200).json({ posts });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.createPost = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).json({ error: "Image could not be uploaded" })
        let post = new Post(fields)
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({ errors: err })
            }

            res.json(result)
        })


    })

}

exports.postsByUser = async (req, res) => {
    try {
        const post = await Post.find({ postedBy: req.profile._id }).populate("postedBy", "_id name").sort("_created")
        if (!post) return res.status(400).json({ error: "No posts found" })
        res.json(post)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.deletePost = async (req, res) => {
    try {
        let post = req.post
        const rm = await post.remove()
        res.json({ message: "Post was successfully deleted" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.updatePost = async (req, res, next) => {
    try {
        let post = req.post;
        post = _.extend(post, req.body);
        post.updated = Date.now();
        const result = await post.save();
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}
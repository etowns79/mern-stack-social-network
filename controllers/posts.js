const Post = require('../models/post')
const formidable = require('formidable');
const fs = require('fs')
const { check, validationResult } = require('express-validator')

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
